/**
 * Created by Ali on 2/19/2017.
 */

const env = require('../../env');
const sql = require('../../sql');

describe("Test 'branch_stock_rules' table", () => {
  let unit_id;
  let product_id;
  let isAdded = false;

  beforeAll((done) => {
    //Create units, products tables
    //And add some rows to these tables

    sql.test.units.create()             //Create units table
      .then((res) => {
        return sql.test.products.create();
      })             //Create products table
      .then((res) => {
        return sql.test.branch_stock_rules.create();
      })             //Create branch_stock_rules table
      .then((res) => {
        return sql.test.units.add({
          name: 'Baker Street',
          username: 'JohnSmith',
          secret: '123',
          is_branch: true
        })
      })             //Add a unit to units table
      .then((res) => {
        unit_id = res.uid;
        return sql.test.products.add({
          prep_unit_id: res.uid,
          code: 'FO01',
          name: 'Frying Oil',
          size: 17,
          measuring_unit: 'Kg',
          default_max: 3,
          default_min: 1,
          default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
          default_usage: 2
        });
      })             //Add a product to products table
      .then((res) => {
        product_id = res.pid;
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });

  it('should add new record to table', (done) => {
    sql.test.branch_stock_rules.add({
      pid: product_id,
      uid: unit_id,
      max: 3,
      min: 2,
      usage: 1
    })
      .then((res) => {
        expect(typeof res.bsrid).toBe('number');
        isAdded = true;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it('should get rows with unit id', (done) => {
    if(isAdded){
      sql.test.branch_stock_rules.get({uid: unit_id})
        .then((res) => {
          expect(res.length).toBe(1);
          expect(res[0].max).toBe(3);
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        })
    }
  });

  it('should update a specific row', (done) => {
    if(isAdded) {
      sql.test.branch_stock_rules.update({
        max: 3,
        min: 2,
        start_date: null,
        end_date: null,
        date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
        mon_multiple: null,
        tue_multiple: null,
        wed_multiple: null,
        thu_multiple: null,
        fri_multiple: null,
        sat_multiple: null,
        sun_multiple: null,
        usage: 1,
        pid: product_id,
        uid: unit_id
      })
        .then((res) => {
          expect(res).toBeTruthy();
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        })
    }
  });

  it('should get just one row with unit id and product id', (done) => {
    if(isAdded){
      sql.test.branch_stock_rules.getByUnitProductId({
        pid: product_id,
        uid: unit_id
      })
        .then((res) => {
          expect(res.length).toBe(1);
          expect(res[0].max).toBe(3);
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        })
    }
  });

  it('should delete a specific row', (done) => {
    if(isAdded){
      sql.test.branch_stock_rules.delete({
        uid: unit_id,
        pid: product_id
      })
        .then((res) => {
          expect(res).toBeTruthy();
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        })
    }
  });

  afterAll((done) => {
    if(isAdded){
      sql.test.branch_stock_rules.drop()           //Drop branch_stock_rules table
        .then(() => {
          return sql.test.products.drop();
        })                   //Drop products table
        .then(() => {
          return sql.test.units.drop();
        })                   //Drop units table
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    }
    else
      done();
  });
});