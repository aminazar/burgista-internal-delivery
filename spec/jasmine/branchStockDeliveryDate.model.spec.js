/**
 * Created by Amin on 06/03/2017.
 */
const env = require('../../env');
const sql = require('../../sql');
const lib = require('../../lib');
const moment = require('moment');
let Stock = lib.Stock;
let Product = lib.Product;
Stock.test = true;
Product.test = true;

describe("Branch Stock Delivery Date Model", () => {
  let prep_uid, prep_uid_2, branch_id_1, branch_id_2, product_id_1, product_id_2, product_id_3, product_id_4, product_id_5, bsddAfterBranch2, testing_lid, bsddid;
  let product_data_1 = {
    code: '1011',
    name: 'apple',
    size: 2,
    measuring_unit: 'Kg',
    default_max: 10,
    default_min: 3,
    default_date_rule: 'DTSTART=20170305;INTERVAL=1;FREQ=WEEKLY;BYDAY=TU,FR',
    default_mon_multiple: 1,
    default_tue_multiple: 1,
    default_wed_multiple: 1,
    default_thu_multiple: 1,
    default_fri_multiple: 2,
    default_sat_multiple: 2,
    default_sun_multiple: 2,
    default_usage: 3
  };

  let product_data_2 = {
    code: 1012,
    name: 'orange',
    size: 3,
    measuring_unit: 'Kg',
    default_max: 20,
    default_min: 5,
    default_date_rule: 'DTSTART=20170305;FREQ=DAILY;INTERVAL=3',
    default_mon_multiple: 2,
    default_tue_multiple: 2,
    default_wed_multiple: 1,
    default_thu_multiple: 1,
    default_fri_multiple: 1,
    default_sat_multiple: 1,
    default_sun_multiple: 1,
    default_usage: 1
  };

  let product_data_3 = {
    code: '1013',
    name: 'banana',
    size: 1,
    measuring_unit: 'Kg',
    default_max: 16,
    default_min: 4,
    default_date_rule: 'DTSTART=20170305;FREQ=DAILY;INTERVAL=10',
    default_mon_multiple: 1,
    default_tue_multiple: 1,
    default_wed_multiple: 1,
    default_thu_multiple: 1,
    default_fri_multiple: 1,
    default_sat_multiple: 1,
    default_sun_multiple: 1,
    default_usage: 6
  };

  let product_data_4 = {
    code: '1014',
    name: 'kabbage',
    size: 2,
    measuring_unit: 'Kg',
    default_max: 13,
    default_min: 7,
    default_date_rule: 'DTSTART=20170305;INTERVAL=1;FREQ=WEEKLY;BYDAY=SA,SU',
    default_mon_multiple: 1,
    default_tue_multiple: 1,
    default_wed_multiple: 1,
    default_thu_multiple: 1,
    default_fri_multiple: 1,
    default_sat_multiple: 1,
    default_sun_multiple: 1,
    default_usage: 9
  };

  let product_data_5 = {
    code: '1015',
    name: 'cream',
    size: 2,
    measuring_unit: 'Kg',
    default_max: 13,
    default_min: 7,
    default_date_rule: '',
    default_mon_multiple: 1,
    default_tue_multiple: 1,
    default_wed_multiple: 1,
    default_thu_multiple: 1,
    default_fri_multiple: 1,
    default_sat_multiple: 1,
    default_sun_multiple: 1,
    default_usage: 9
  };

  let override_1 = {
    min: 10,
    max: 15,
    tue_multiple: 2,
  };

  let override_2 = {
    date_rule: 'DTSTART=20170305;FREQ=DAILY;INTERVAL=2',
    usage: 2,
  };

  beforeAll((done) => {
    lib.helpers.createOrExist('units', sql.test)
      .then(() => {
        return lib.helpers.createOrExist('last_login', sql.test);
      })//create last login table
      .then(() => {
        return sql.test.units.add({
          name: 'Ali salehi',
          username: 'asalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })//adding branch 1
      .then(res => {
        branch_id_1 = res.uid;
        return sql.test.units.add({
          name: 'Sareh salehi',
          username: 'sasalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })//adding branch 2
      .then(res => {
        branch_id_2 = res.uid;
        return sql.test.units.add({
          name: 'Sadra salehi',
          username: 'sadsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })//adding prep unit
      .then(res => {
        prep_uid = res.uid;
        return sql.test.units.add({
          name: 'Amin Azar',
          username: 'aminazar',
          secret: 'qwerty',
          is_branch: false
        })
      })//adding prep unit
      .then((res) => {
        prep_uid_2 = res.uid;
        return lib.helpers.createOrExist('products', sql.test);
      })//create products table
      .then(() => {
          return lib.helpers.createOrExist('prices', sql.test);
      })//create prices
      .then(() => {
        product_data_1.prep_unit_id = prep_uid;
        return sql.test.products.add(product_data_1)
      })//adding product 1
      .then(res => {
        product_id_1 = res.pid;
        product_data_2.prep_unit_id = prep_uid;
        return sql.test.products.add(product_data_2)
      })//adding product 2
      .then(res => {
        product_id_2 = res.pid;
        product_data_3.prep_unit_id = prep_uid_2;
        return sql.test.products.add(product_data_3)
      })//adding product 3
      .then(res => {
        product_id_3 = res.pid;
        product_data_4.prep_unit_id = prep_uid_2;
        return sql.test.products.add(product_data_4)
      })//adding product 4
      .then((res) => {
        product_id_4 = res.pid;
        return lib.helpers.createOrExist('branch_stock_rules', sql.test);
      })//create branch_stock_rules table
      .then(() => {
        let product = new Product();
        product.update(override_2, product_id_2, 'admin', branch_id_1)
      })//override product 1 for branch 1
      .then(() => {
        let product = new Product();
        product.update(override_1, product_id_1, 'admin', branch_id_2)
      })//override product 1 for branch 2
      .then(() => {
        return lib.helpers.createOrExist('branch_stock_delivery_date', sql.test);
      })//creating BSDD table
      .then(() => {
        return sql.test.last_login.add({
          login_uid: branch_id_1,
          login_date: moment().format('YYYY-MM-DD'),
          previous_login_date_time: moment('2017-03-06').toDate()
        });
      })//adding last_login for branch 1
      .then(res => {
        return sql.test.last_login.update({login_date_time: moment('2017-03-13').toDate()}, res.lid);
      })//updating last login for branch 1 to have constant login date
      .then(() => {
        return sql.test.last_login.add({
          login_uid: branch_id_2,
          login_date: moment().format('YYYY-MM-DD'),
          previous_login_date_time: moment('2017-03-06').toDate()
        });
      })//adding last_login for branch 2
      .then(res => {
        testing_lid = res.lid;
        return sql.test.last_login.update({login_date_time: moment('2017-03-08').toDate()}, res.lid);
      })//updating last login for branch 2 to have constant login date
      .then(() => {
        return sql.test.last_login.add({login_uid: prep_uid, login_date: moment().format('YYYY-MM-DD'), previous_login_date_time: moment('2017-03-06').toDate()});
      })//adding last_login for prep_unit 1
      .then(res => {
        return sql.test.last_login.update({login_date_time: moment('2017-03-13').toDate()}, res.lid);
      })//updating last login for prp_unit to have constant login date
      .then(() => {
        done();
      })//done
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it('should calculate minimum required of the product in a date', () => {
    expect(Stock.calcMin(product_data_1, moment('2017-03-09'))).toBe(9);
    expect(Stock.calcMin(product_data_1, moment('2017-03-10').tz('Europe/London'))).toBe(18);
    expect(Stock.calcMin(product_data_3, moment('2017-03-10'))).toBe(24);
  });

  it('should check if a date is included in the recursion rule of product', () => {
    let func = Stock.rRuleCheck(product_data_1.default_date_rule, moment('2017-03-01'), moment('2017-03-31'));
    expect(func('2017-03-07')).toBe(true);
    expect(func('2017-03-08')).toBe(false);
    expect(func(new Date('2017-03-07'))).toBe(true);
  });

  it('should not do anything when unit is prep', done => {
    Stock.branchStockDeliveryDateFunc(prep_uid, false)
      .then(() => {
        sql.test.branch_stock_delivery_date.select()
          .then(res => {
            expect(res.length).toBe(0);
            done()
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 1', done => {
    Stock.select(branch_id_1, new Date('13Mar17'))
      .then(res => {
        expect(res.length).toBe(4);
        expect(res.filter(el => el.bsddid === null).length).toBe(4);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });//before login

  it('should insert BSDD item for product/branch 1', done => {
    Stock.branchStockDeliveryDateFunc(branch_id_1, true)
      .then(() => {
        sql.test.branch_stock_delivery_date.select()
          .then(res => {
            expect(res.length).toBe(3);
            expect(res.filter(el => el.bsddid !== null).length).toBe(3);
            expect(res.filter(el => el.branch_id === 1).length).toBe(3);
            //TODO correct date
            expect(moment(res[0].counting_date).utc().format('YY-MM-DD')).toContain('17-03-12');
            expect(moment(res[1].counting_date).utc().format('YY-MM-DD')).toContain('17-03-11');
            expect(moment(res[2].counting_date).utc().format('YY-MM-DD')).toContain('17-03-09');
            done();
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });//after login

  it('should select right rows for inventory - branch 1', done => {
    Stock.select(branch_id_1, new Date('13Mar17'))
      .then(res => {
        expect(res.filter(el => el.bsddid === null).length).toBe(1);
        expect(res.filter(el => el.bsddid !== null).length).toBe(3);
        expect(res.length).toBe(4);
        let p1 = res.filter(r => r.pid === product_id_1);
        expect(p1.length).toBe(1);
        if (p1.length === 1) {
          expect(moment(p1[0].counting_date).format('YYMMDD')).toBe('170310');
          expect(p1[0].bsddid).not.toBe(null);
          expect(p1[0].last_count).toBe(null);
        }

        let p2 = res.filter(r => r.pid === product_id_2);
        expect(p2.length).toBe(1);
        if (p2.length === 1) {
          expect(moment(p2[0].counting_date).format('YYMMDD')).toBe('170313');
          expect(p2[0].bsddid).not.toBe(null);
          expect(p2[0].last_count).toBe(null);
        }

        let p3 = res.filter(r => r.pid === product_id_3);
        expect(p3.length).toBe(1);
        if (p3.length === 1) {
          expect(p3[0].counting_date).toBe(null);
          expect(p3[0].bsddid).toBe(null);
          expect(p3[0].last_count).toBe(null);
        }
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 2', done => {
    Stock.select(branch_id_2, new Date('13Mar17'))
      .then(() => {
        expect(true).toBe(true);
        done();
      })
      .catch(err => {
        fail(err.message);
        console.log(err);
        done();
      })
  });

  it('should insert BSDD item for product/branch 2', done => {
    Stock.branchStockDeliveryDateFunc(branch_id_2, true)
      .then(() => {
        sql.test.branch_stock_delivery_date.select()
          .then(res => {
            expect(res.length).toBe(5);
            done();
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  })

  it('should select right rows for inventory - branch 2', done => {
    Stock.select(branch_id_2, new Date('13Mar17'))
      .then(res => {
        bsddAfterBranch2 = res;
        expect(true).toBe(true);
        done();
      })
      .catch(err => {
        fail(err.message);
        done();
      })
  });

  it('should save stock count', done => {
    let s = new Stock();
    bsddAfterBranch2[0].product_count = 3;
    bsddAfterBranch2[0].product_id = bsddAfterBranch2[0].pid;
    s.saveData(bsddAfterBranch2[0], branch_id_2)
      .then(() => {
        sql.test.branch_stock_delivery_date.select()
          .then(res => {
            expect(res.length).toBe(5);
            done();
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should save stock count - checking', done => {
    Stock.select(branch_id_2, new Date('7Mar17'))
      .then(res => {
        let p = res.filter(r => r.bsddid === bsddAfterBranch2[0].bsddid);
        expect(p.length).toBe(1);
        if (p.length === 1) {
          expect(moment(p[0].last_count).isSame(moment(), 'minute'));
        }
        bsddAfterBranch2 = res;
        sql.test.branch_stock_delivery_date.get({id: bsddAfterBranch2[0].bsddid})
          .then(res => {
            expect(res.length).toBe(1);
            expect(res[0].product_count).toBe(3);
            done();
          })
          .catch(err => {
            fail(err.message);
            console.log(err);
            done();
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should save unlisted product', done => {
    let s = new Stock();
    let unlisted = bsddAfterBranch2.filter(r => r.bsddid === null);
    expect(unlisted.length).toBe(3);
    if (unlisted.length > 0) {
      unlisted[0].product_id = product_id_3;
      unlisted[0].product_count = 10;
      s.saveData(unlisted[0], branch_id_2)
        .then(res => {
          sql.test.branch_stock_delivery_date.get({id: res})
            .then(res => {
              expect(res[0].product_count).toBe(10);
              expect(res[0].product_id).toBe(product_id_3);
              expect(res[0].branch_id).toBe(branch_id_2);
              expect(res[0].min_stock).toBe(24);
              expect(moment(res[0].counting_date).format('YYMMDD')).toBe(moment().format('YYMMDD'));
              expect(moment(res[0].submission_date).isSame(moment(), 'minute'));
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    }
    else
      done();
  });

  it('should return right delivery rows through SQL - branch 2', done => {
    sql.test.branch_stock_delivery_date.getBranchDelivery({
      prep_uid: prep_uid,
      date: moment('2017-03-07').format('YYYY-MM-DD'),
      uid: branch_id_2
    })
      .then(res => {
        expect(res.length).toBe(2);
        res = res.filter(r => r.product_id === product_id_1);
        expect(res.length).toBe(1);
        if (res.length === 1) {
          expect(res[0].product_count).toBe(3);
          expect(res[0].is_delivery_finalised).toBe(false);
          expect(res[0].real_delivery).toBe(null);
          expect(res[0].default_max).toBe(product_data_1.default_max);
          expect(res[0].max).toBe(override_1.max);
          expect(Stock.calcMax(res[0], new Date('7Mar17') )).toBe(override_1.max * product_data_1.default_usage * override_1.tue_multiple);
          expect(Stock.calcMin(res[0], new Date('7Mar17'))).toBe(60);
        }
        done();
      })
      .catch(err => {
        fail(err);
        console.log(err);
        done();
      });
  });

  it('should return right delivery rows through model - branch 2', done => {
    Stock.deliverySelect(prep_uid, branch_id_2, '20170307')
      .then(res => {
        expect(res.length).toBe(2);
        res = res.filter(r => r.productName === product_data_1.name);
        expect(res.length).toBe(1);
        if (res.length === 1) {
          expect(res[0].stock).toBe(3);
          expect(res[0].isPrinted).toBe(false);
          expect(res[0].max).toBe(override_1.max * product_data_1.default_usage * override_1.tue_multiple);
          expect(res[0].min).toBe(60);
          expect(res[0].productCode).toBe(product_data_1.code);
          expect(res[0].realDelivery).toBe(null);
          expect(res[0].id).not.toBe(null);
          bsddid = res[0].id;
        }

        done();
      })
      .catch(err => {
        fail(err);
        console.log(err);
        done();
      });
  });

  it('should save real delivery', done => {
    let s = new Stock();
    s.saveData({
      real_delivery: 10,
      is_delivery_finalised: true,
    }, branch_id_2, bsddid)
      .then(() => {
        Stock.deliverySelect(prep_uid, branch_id_2, '20170307')
          .then(res => {
            expect(res.length).toBe(2);
            res = res.filter(r => r.productName === product_data_1.name);
            expect(res.length).toBe(1);
            if (res.length === 1) {
              expect(res[0].isPrinted).toBe(true);
              expect(res[0].realDelivery).toBe(10);
              expect(res[0].id).toBe(bsddid);
            }

            done();
          })
      })
      .catch(err => {
        fail(err);
        console.log(err);
        done();
      });
  });

  it('should NOT throw an error if branch logins for the second time', done => {
    return sql.test.last_login.update({
      login_date_time: '2017-03-10',
      previous_login_date_time: '2017-03-07'
    }, testing_lid)
      .then(() => {
        return Stock.branchStockDeliveryDateFunc(branch_id_2, true)
          .then(() => {
            sql.test.branch_stock_delivery_date.select()
              .then(res => {
                expect(res.length).toBe(7);
                res = res.filter(el => el.product_id === product_id_1 && el.branch_id === branch_id_2 && moment(el.counting_date).isSame(moment('2017-03-10'), 'day'));
                expect(res.length).toBe(1);
                if (res.length === 1)
                  bsddid = res[0].id;
                done();
              })
          })
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should return right delivery rows through model for next day - branch 2 ', done => {
    Stock.deliverySelect(prep_uid, branch_id_2, '20170310')
      .then(res => {
        expect(res.length).toBe(2);
        res = res.filter(r=>r.id);
        expect(res.length).toBe(2);
        res = res.filter(r => r.productName === product_data_1.name);
        expect(res.length).toBe(1);
        if (res.length === 1) {
          expect(res[0].stock).toBe(null);
          expect(res[0].isPrinted).toBe(false);
          expect(res[0].max).toBe(override_1.max * product_data_1.default_usage * override_1.tue_multiple);
          expect(res[0].min).toBe(60);
          expect(res[0].productCode).toBe(product_data_1.code);
          expect(res[0].realDelivery).toBe(null);
          expect(res[0].id).not.toBe(null);
          bsddid = res[0].id;
        }

        done();
      })
      .catch(err => {
        fail(err);
        console.log(err);
        done();
      });
  });

  it('should save real delivery for next day', done => {
    let s = new Stock();
    s.saveData({
      real_delivery: 15,
      is_delivery_finalised: true,
    }, branch_id_2, bsddid)
      .then(() => {
        Stock.deliverySelect(prep_uid, branch_id_2, '20170310')
          .then(res => {
            expect(res.length).toBe(2);
            res = res.filter(r=>r.id);
            expect(res.length).toBe(2);
            res = res.filter(r => r.productName === product_data_1.name);
            expect(res.length).toBe(1);
            if (res.length === 1) {
              expect(res[0].isPrinted).toBe(true);
              expect(res[0].realDelivery).toBe(15);
              expect(res[0].id).toBe(bsddid);
            }

            done();
          })
      })
      .catch(err => {
        fail(err);
        console.log(err);
        done();
      });
  });

  it('should save unlisted delivery', done => {
    let s = new Stock();

    product_data_5.prep_unit_id = prep_uid;
    sql.test.products.add(product_data_5)
      .then(res => {
        product_id_5 = res.pid;

        s.saveData({
          branch_id: branch_id_2,
          product_id: product_id_5,
          real_delivery: 15,
          is_delivery_finalised: true,
        }, branch_id_2)
          .then(res => {
            bsddid = res;
            return Stock.deliverySelect(prep_uid, branch_id_2, new Date())
              .then(res => {
                res = res.filter(r => r.id == bsddid);
                expect(res.length).toBe(1);
                if (res.length === 1) {
                  expect(res[0].id).toBe(bsddid);
                  expect(res[0].isPrinted).toBe(true);
                  expect(res[0].realDelivery).toBe(15);
                  expect(res[0].productName).toBe(product_data_5.name);
                }
                done();
              })
          })
      })
      .catch(err => {
        fail(err.message);
        console.log(err);
        done();
      });
  });

  afterAll((done) => {
    let dropOrNotExist = function (tableName) {
      return lib.helpers.dropOrNotExit(tableName, sql.test)
    };
    dropOrNotExist('last_login')
      .then(() => {
        return dropOrNotExist('branch_stock_delivery_date')
      })
      .then(() => {
        return dropOrNotExist('branch_stock_rules')
      })
      .then(() => {
        return dropOrNotExist('prices')
      })
      .then(() => {
        return dropOrNotExist('products')
      })
      .then(() => {
        return dropOrNotExist('units')
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });
});