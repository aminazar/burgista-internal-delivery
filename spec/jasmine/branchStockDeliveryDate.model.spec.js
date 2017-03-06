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

describe("Branch Stock Delivery Date Model", () =>
{
  let prep_uid, branch_id_1, branch_id_2, product_id_1, product_id_2,bsddAfterBranch2;
  let product_data_1 = {
    code: 1011,
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

  let override_2 = {
    date_rule: 'DTSTART=20170305;FREQ=DAILY;INTERVAL=2',
    usage: 2,
  };
  beforeAll((done) => {
    lib.helpers.createOrExist('units',sql.test)
      .then(() => {
        return lib.helpers.createOrExist('last_login',sql.test);
      })//create last login table
      .then(() => {
        return sql.test.units.add({
          name: 'Ali salehi',
          username: 'asalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })//adding branch 1
      .then( res => {
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
      .then((res) => {
        prep_uid = res.uid;
        return lib.helpers.createOrExist('products', sql.test);
      })//create products table
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
        return lib.helpers.createOrExist('branch_stock_rules',sql.test);
      })
      .then(() => {
        let product = new Product();
        product.update(override_2, product_id_2, 'admin', branch_id_1)
      })//override product 2 for branch 1
      .then(() => {
        return lib.helpers.createOrExist('branch_stock_delivery_date',sql.test);
      })//creating BSDD table
      .then(()=>{
        return sql.test.last_login.add({login_uid:branch_id_1,previous_login_date_time:moment('2017-03-06').toDate()});
      })//adding last_login for branch 1
      .then(res =>{
        return sql.test.last_login.update({login_date_time:moment('2017-03-13').toDate()},res.lid);
      })//updating last login for branch 1 to have constant login date
      .then(()=>{
        return sql.test.last_login.add({login_uid:branch_id_2,previous_login_date_time:moment('2017-03-06').toDate()});
      })//adding last_login for branch 2
      .then(res =>{
        return sql.test.last_login.update({login_date_time:moment('2017-03-08').toDate()},res.lid);
      })//updating last login for branch 2 to have constant login date
      .then(()=>{
        return sql.test.last_login.add({login_uid:prep_uid,previous_login_date_time:moment('2017-03-06').toDate()});
      })//adding last_login for prep_unit
      .then(res =>{
        return sql.test.last_login.update({login_date_time:moment('2017-03-13').toDate()},res.lid);
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
    expect(Stock.calcMin(product_data_1, moment('2017-03-10'))).toBe(18);
  });

  it('should check if a date is included in the recursion rule of product', () => {
    let func = Stock.rRuleCheckFunctionFactory(product_data_1.default_date_rule,moment('2017-03-01'),moment('2017-03-31'));
    expect(func('2017-03-07')).toBe(true);
    expect(func('2017-03-08')).toBe(false);
    expect(func(new Date('2017-03-07'))).toBe(true);
  });

  it('should not do anything when unit is prep', done => {
    Stock.branchStockDeliveryDateFunc(prep_uid,false)
      .then(()=>{
        sql.test.branch_stock_delivery_date.select()
          .then(res=>{
            expect(res.length).toBe(0);
            done()
          })
      })
      .catch(err=>{
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 1', done => {
    Stock.select(branch_id_1,new Date('13Mar17'))
      .then(res => {
        expect(res.length).toBe(2);
        expect(res.filter(el=>el.bsddid===null).length).toBe(2);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should insert BSDD item for product/branch 1', done => {
   Stock.branchStockDeliveryDateFunc(branch_id_1,true)
      .then(()=>{
        sql.test.branch_stock_delivery_date.select()
          .then(res=>{
            expect(res.length).toBe(2);
            expect(res[0].branch_id).toBe(1);
            expect(res[1].branch_id).toBe(1);
            done()
          })
      })
      .catch(err=>{
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 1', done => {
    Stock.select(branch_id_1,new Date('13Mar17'))
      .then(res => {
        console.log(res);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 2', done => {
    Stock.select(branch_id_2,new Date('13Mar17'))
      .then(res => {
        console.log(res);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should insert BSDD item for product/branch 2', done => {
    Stock.branchStockDeliveryDateFunc(branch_id_2,true)
      .then(()=>{
        sql.test.branch_stock_delivery_date.select()
          .then(res=>{
            expect(res.length).toBe(4);
            done();
          })
      })
      .catch(err=>{
        console.log(err);
        done();
      })
  });

  it('should select right rows for inventory - branch 2', done => {
    Stock.select(branch_id_2,new Date('13Mar17'))
      .then(res => {
          bsddAfterBranch2 = res;
          done();
      })
      .catch(err => {
        console.log(err);
        done();
      })
  });

  it('should save row as ')
  afterAll((done) => {
    let dropOrNotExist = function(tableName) {
      return lib.helpers.dropOrNotExit(tableName,sql.test)
    };
    dropOrNotExist('last_login')
      .then(() => {
        return dropOrNotExist('branch_stock_delivery_date')
      })
      .then(()=>{
        return dropOrNotExist('branch_stock_rules')
      })
      .then(() => {
        return dropOrNotExist('products')
      })
      .then(() => {
        return dropOrNotExist('units')
      })
      .then(() =>{
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });
});
