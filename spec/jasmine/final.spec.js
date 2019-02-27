const lib = require('../../lib');
const sql = require('../../sql');
const env = require('../../env');
const {Product, Unit, Stock, Price} = lib;
const shell = require('shelljs');
const rrule = require('rrule').RRule;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
describe('final spec', () => {
  const d = '2019-02-25';
  beforeAll(async function () {
    await env.initDb.query(`
      SELECT
      pg_terminate_backend(pid)
    FROM
      pg_stat_activity
    WHERE
      -- don't kill my own connection!
      pid <> pg_backend_pid()
      -- don't kill the connections to other databases
      AND datname = '${env.test_db_name}'
      ;`);
    await new Promise(resolve => setTimeout(async () => {
      try {
        console.log('dropping test database:');
        await sql.db.drop({dbName: env.test_db_name}, true);
      } catch (e) {
        console.log("it seems it doesn't exist")
      }
      console.log('creating test db:');
      await sql.db.create({dbName: env.test_db_name}, true);
      console.log('restoring from test db from the scratch:');
      const path = shell.pwd();
      await new Promise(res => {
        shell.exec(`pg_restore ${path}/spec/sample.dump -U postgres -d burgista_test`, {silent: true}, () => {
          console.log('it is done for ' + env.test_db_name);
          [Product, Unit, Stock, Price].forEach(c => {
            c.date = d;
            c.test = true;
          });
          console.log('beforeEach is done');
          res();
          resolve();
        });
      });
    }, 50));
  });

  it('passes trivial test', async () => {
    try {
      p = new Product(true);
      p.name = 'Frying oil';
      p.code = 'fo01';
      p.prep_unit_id = 2;
      p.size = 10;
      p.measuring_unit = 'Kg';
      p.default_max = 12;
      p.default_min = 11;
      p.default_date_rule = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
      pid = await p.save();
      expect(pid).toBe(190);
    } catch (e) {
      console.log(e);
    }
  });

  it('after login test', async () => {
    const units = await env.testDb.any('select * from units');
    await env.testDb.query(`update last_login set login_date_time='2019-02-24'`);
    for (let u of units.filter(u =>  u.is_branch)) {
      await Unit.saveDateAfterLogin(u.name, u.username, true, u.uid, u.is_kitchen);
      const res2 = await env.testDb.any(`select
	*
from
	branch_stock_delivery_date b
join products on
	products.pid = b.product_id
left outer join branch_stock_rules r on
	r.uid = b.branch_id
	and r.pid = b.product_id
where
	branch_id = ${u.uid}
	and counting_date ='${d}'`);
      const x = res2.map(r => {
        const rule = r.bsrid ? r.date_rule ? r.date_rule : '' : r.default_date_rule;
        const rr = rrule.fromString(rule);
        // rr.options.dtstart = new Date('2019-01-01T00:00:00Z');
        return {
          dates: rr.between(new Date('2019-02-24T23:59:00Z'), new Date('2019-02-25T23:59:00Z')),
          rule,
          name: r.name,
          pid: r.pid,
          uid: r.uid,
        }
      })
        .filter(r => !r.dates.length);
      expect(x.length).toBe(0, 'No wrong entries for ' + u.name + '\n' + JSON.stringify(x, null, 2));
      if (res2.length) {
        let res3 = await env.testDb.any(`select
	*
from
	products
left outer join branch_stock_rules r on
	r.uid = ${u.uid}
	and r.pid = products.pid
where
  prep_unit_id = ${u.is_kitchen ? 11 : 2 } and
	products.pid not in (${res2.map(r => r.product_id).join(",")})`);

        const y = res3.map(r => {
          const rule = r.bsrid ? r.date_rule ? r.date_rule : '' : r.default_date_rule;
          const rr = rrule.fromString(rule);
          // rr.options.dtstart = new Date('2019-01-01T00:00:00Z');
          return {
            dates: rr.between(new Date('2019-02-24T23:59:00Z'), new Date('2019-02-25T23:59:00Z')),
            rule,
            name: r.name,
            pid: r.pid,
            uid: r.uid,
          }
        })
          .filter(r => r.dates.length);
        expect(y.length).toBe(0, 'No missed items for ' + u.name + '\n' + JSON.stringify(y, null, 2));
      }
      res4 = await Stock.select(u.uid, d, u.uid);

      let extra = res4.filter(r => r.counting_date && +r.counting_date.toString().substr(8,2) === 25 && !res2.find(s => r.pid === s.product_id));
      let missing = res2.filter(r => !res4.find(s => r.product_id === s.pid));
      expect(extra.length).toBe(0, 'Max select no extra items for ' + u.name + '\n' + JSON.stringify(extra.map(r => [r.pid, r.counting_date.toString().substr(8,2), r.name]), null, 2));
      expect(missing.length).toBe(0, 'Max select no missing items for ' + u.name+ '\n' + JSON.stringify(missing, null, 2));

      res5 = await Stock.deliverySelect(u.is_kitchen ? 11 : 2, u.uid, d, u.is_kitchen);
      extra = res5.filter(r => r.counting_date && +r.counting_date.toString().substr(8,2) === 25 && !res2.find(s => r.productId === s.product_id));
      missing = res2.filter(r => !res5.find(s => r.product_id === s.productId));
      expect(extra.length).toBe(0, 'Delivery select no extra items for ' + u.name + '\n' + JSON.stringify(extra.map(r => [r.pid, r.counting_date.toString().substr(8,2), r.name]), null, 2));
      expect(missing.length).toBe(0, 'Delivery select no missing items for ' + u.name+ '\n' + JSON.stringify(missing.map(r => [r.pid, r.counting_date.toString().substr(8,2), r.name]), null, 2));
    }
  });

  it('should find the recurring dates correctly', () => {
    [
      'DTSTART=20180617T230106Z;INTERVAL=1;FREQ=WEEKLY;BYDAY=MO',
      // 'DTSTART:20180617T225056Z\nRRULE:FREQ=DAILY;INTERVAL=4',
    ].forEach(r => {
      expect(Stock.rRuleCheck(r, new Date('2019-02-24'), '2019-02-25')).toBeTruthy();
    });
  });

  // afterEach(async () => {
  //   console.log('dropping test database:');
  //   await sql.db.drop({dbName: env.test_db_name}, true);
  // });
});

