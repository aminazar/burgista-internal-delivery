/** Created by Sareh on 3/29/2017.**/
const request = require("request");
const base_url = "http://localhost:3000/api/";
const timed_test_query = '?test=tEsT';
const lib = require('../lib');
const sql = require('../sql');
const moment = require('moment');
let req = request.defaults({jar: true});//enabling cookies

let resExpect = (res, statusCode) => {
  if (res.statusCode !== statusCode) {
    let jres = '';
    try {
      jres = res.body ? JSON.parse(res.body) : '';
    }
    catch (err) {
    }
    let msg = jres.Message ? jres.Message : jres;
    expect(res.statusCode).toBe(statusCode, `Expected response code ${statusCode}, received ${res.statusCode}. Server response: ${msg}`);
    if (jres.Stack) {
      let err = new Error();
      err.message = jres.Message;
      err.stack = jres.Stack;
      console.log(`Server responds with unexpected error:`, err);
    }
    return false;
  }
  return true;
};

describe("REST API/ Stock API", ()=> {

  describe("stock", () => {
    let test_uid1,test_uid2,test_uid3,test_uid4,test_pid1,test_pid2,test_pid3,test_pid4,test_data,test_bsddid,adminUid;
    let override_1 = {
      date_rule: 'DTSTART=20170303;FREQ=WEEKLY;INTERVAL=1;BYDAY=SA,MO',
      usage: 2,
    };
    let override_2 = {
      date_rule: 'DTSTART=20170303;FREQ=DAILY;INTERVAL=3',
      usage: 2,
    };

    beforeEach((done) => {
      let create = tableName => lib.helpers.createOrExist(tableName,sql.test);
        create('units') //create units table
          .then ((res)=>{
            return create('last_login');
          })//Create last_login table
          .then((res) => {
            return create('products');
          })//Create products table
          .then((res) => {
            return create('branch_stock_rules');
          })//Create branch_stock_rules table
          .then((res) => {
            return create('branch_stock_delivery_date');
          })//Create branch_stock_delivery_date table
          .then((res) => {
            let branch = new lib.Unit(true);
            branch.name = 'Ali Salehi';
            branch.username = 'alisalehi';
            branch.password = '12345';
            branch.is_branch = true;
            return branch.save();
          })//Add an unit (branch unit)
          .then((res) => {
            test_uid1 = res;
            u = new lib.Unit(true);
            u.name = 'Sareh Salehi';
            u.username = 'sarehsalehi';
            u.password = '12345';
            u.is_branch = true;
            return u.save();
          })//Add an unit (branch unit)
          .then((res) => {
            test_uid2 = res;
            u = new lib.Unit(true);
            u.name = 'Sadra Salehi';
            u.username = 'sadrasalehi';
            u.password = '12345';
            u.is_branch = false;
            return u.save();
          })//Add an unit (prep unit)
          .then((res) => {
            test_uid3 = res;
            u = new lib.Unit(true);
            u.name = 'Negar Salehi';
            u.username = 'negarsalehi';
            u.password = '12345';
            u.is_branch = false;
            return u.save();
          }) //Add another unit (prep unit)
          .then((res) => {
            test_uid4 = res;
            p = new lib.Product(true);
            p.name = 'Frying oil';
            p.code = 'fo01';
            p.prep_unit_id = test_uid3;
            p.size = 10;
            p.measuring_unit = 'Kg';
            p.default_max = 12;
            p.default_min = 11;
            p.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return p.save();
          }) //Add a product
          .then((res) => {
            test_pid1 = res;
            let product = new lib.Product(true);
            product.name = 'Meat';
            product.code = 'm01';
            product.prep_unit_id = test_uid4;
            product.size = 20;
            product.measuring_unit = 'Kg';
            product.default_max = 5;
            product.default_min = 2;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid2 = res;
            let product = new lib.Product(true);
            product.name = 'orange';
            product.code = 'o01';
            product.prep_unit_id = test_uid3;
            product.size = 20;
            product.measuring_unit = 'gr';
            product.default_max = 50;
            product.default_min = 6;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid3 = res;
            let product = new lib.Product(true);
            product.name = 'apple';
            product.code = 'a01';
            product.prep_unit_id = test_uid4;
            product.size = 10;
            product.measuring_unit = 'gr';
            product.default_max = 20;
            product.default_min = 2;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T121903Z;INTERVAL=1000';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid4 = res;
            let a = new lib.Unit(true);
            a.name = 'Admin';
            a.username = 'admin';
            a.password = '11111';
            a.is_branch = false;
            return a.save();
          })//Add admin user (into units table)
          .then((res) => {
            adminUid = res;
            let product = new lib.Product(true);
            return product.update(override_1, test_pid3, 'admin',test_uid1)
          })//override product 3 for branch 1
          .then(() => {
            let product = new lib.Product(true);
            return product.update(override_2, test_pid3, 'admin',test_uid2)
          })//override product 3 for branch 2
          .then(() => {
            setup = false;
            done();
          })
          .catch((err) => {
            console.log(err.message);
            done();
          })
      });

    it('should pass a inevitable spec', () => {
      expect(true).toBe(true);
    });

    it('should show correct row number of units & last_login & branch_stock_delivery_date & branch_stock_rules table/1', done => {
      sql.test.units.select()
        .then((res) => {
          expect(res.length).toBe(4);
          return sql.test.last_login.select()
        })
        .then((res) => {
          expect(res.length).toBe(0);
          return sql.test.branch_stock_delivery_date.select()
        })
        .then((res) =>{
          expect(res.length).toBe(0);
          return sql.test.branch_stock_rules.select()
        })
        .then((res) =>{
          expect(res.length).toBe(2);
          done();
        })
        .catch((err)=> {
          console.log(err.message);
          done()
        });
    });

    it('should branch1 can login/1',(done) => {
      req.post({
        url: base_url + 'login' + timed_test_query + '&testDate=2017-04-04',
        form: {
          username: 'alisalehi',
          password: '12345'
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }
        expect(response.statusCode).toBe(200);
        sql.test.last_login.select()
          .then((res) => {
            expect(res.length).toBe(1);
            return sql.test.last_login.get_previous_login_date({
              login_uid: 1,
            })
          })
          .then((res) =>{
            expect(res.length).toBe(1);
            expect(res[0].previous_login_date_time).toBe(null);
            expect(res[0].login_uid).toBe(1);
            expect(moment(res[0].login_date_time).format('YYYY-MM-DD')).toBe('2017-04-04');
            return sql.test.branch_stock_delivery_date.select()
          })
          .then((res) =>{
            expect(res.length).not.toBeLessThan(2);
            done();
          })
          .catch((err)=> {
            console.log(err.message);
            done()
          });
        });
    });

    // it('logs out a unit', done => {
    //   req.get(base_url + 'logout' + timed_test_query, (err, res) => {
    //     expect(res.statusCode).toBe(200);
    //     done();
    //   });
    // });
    //
    // it('logs out a unit - checking it happened', done => {
    //   req.put(base_url + 'unit' + timed_test_query, (err, res)=> {
    //     expect(res.statusCode).toBe(403);
    //     done();
    //   });
    // });
    //
    // it('should show correct row number of units & last_login & branch_stock_delivery_date table/2', done => {
    //   sql.test.units.select()
    //     .then((res) => {
    //       expect(res.length).toBe(4);
    //       return sql.test.last_login.select()
    //     })
    //     .then((res) => {
    //       expect(res.length).toBe(1);
    //       return sql.test.branch_stock_delivery_date.select()
    //     })
    //     .then((res) =>{
    //       expect(res.length).not.toBeLessThan(2);
    //       return sql.test.branch_stock_rules.select()
    //     })
    //     .then((res) =>{
    //       expect(res.length).toBe(2);
    //       done();
    //     })
    //     .catch((err)=> {
    //       console.log(err.message);
    //       done()
    //     });
    // });
    //
    // it('should save a coloumn by value 2017-04-09 in last_login table', done => {
    //   return sql.test.last_login.get_previous_login_date({
    //     login_uid: 1,
    //   })
    //   .then((res) =>{
    //     expect(res.length).toBe(1);
    //     expect(res[0].previous_login_date_time).toBe(null);
    //     expect(res[0].login_uid).toBe(1);
    //     expect(moment(res[0].login_date_time).format('YYYY-MM-DD')).toBe('2017-04-09');
    //     done();
    //   })
    // });



    // it('should branch2 can login',(done) => {
    //   req.post({
    //     url: base_url + 'login' + timed_test_query,
    //     form: {
    //       username: 'sarehsalehi',
    //       password: '12345'
    //     }
    //   }, (error, response) => {
    //     if(error){
    //       fail(error.message);
    //       done();
    //     }
    //     expect(response.statusCode).toBe(200);
    //     done();
    //   })
    // });

    // it('should show correct row number of units & last_login & branch_stock_delivery_date table/3', done => {
    //   sql.test.units.select()
    //     .then((res) => {
    //       expect(res.length).toBe(4);
    //       return sql.test.last_login.select()
    //     })
    //     .then((res) => {
    //       expect(res.length).toBe(2);
    //       return sql.test.branch_stock_delivery_date.select()
    //     })
    //     .then((res) =>{
    //       // expect(res.length).toBe(5);
    //       expect(res.length).not.toBeLessThan(4);
    //       return sql.test.branch_stock_rules.select()
    //     })
    //     .then((res) =>{
    //       expect(res.length).toBe(2);
    //       done();
    //     })
    //     .catch((err)=> {
    //       console.log(err.message);
    //       done()
    //     });
    // });

    // it('should get related rows of BSDD table by get request/(related rows to branch 2)' ,(done) =>{
    //   let date = moment().format('YYYYMMDD');
    //   req.get(base_url + 'stock/' + date + timed_test_query, (err, res)=> {
    //     if(err){
    //       fail(err.message);
    //       done();
    //     }
    //     let data = JSON.parse(res.body);
    //     expect(data.length).toBeTruthy();
    //     if(data.length) {
    //       expect(data.length).toBe(4);
    //       expect(data.filter(el => el.bsddid === null).length).not.toBeGreaterThan(2);
    //       expect(data.filter(el => el.last_count === null).length).toBe(4);
    //       test_data = data.filter(el => el.bsddid !== null);
    //     }
    //     done();
    //   })
    // });
    //
    // it('should update a not-null bsddid product from BSDD list',(done) =>{
    //   test_bsddid = test_data[0].bsddid;
    //   req.post({
    //     url: base_url + 'stock/'+ test_bsddid + timed_test_query,
    //     form: {
    //       product_count : 13
    //     }
    //   }, (err, res) => {
    //     if(err){
    //       fail(err.message);
    //       done();
    //     }
    //     expect(res).toBeTruthy();
    //     done();
    //   })
    // });
    //
    // it('should update a not-null bsddid product from BSDD list/checking it happend' ,(done) =>{
    //   let date = moment().format('YYYY-MM-DD');
    //   req.get(base_url + 'stock/' + date + timed_test_query, (err, res)=> {
    //     if(err){
    //       fail(err.message);
    //       done();
    //     }
    //     let data = JSON.parse(res.body);
    //     expect(data.length).toBeTruthy();
    //     if(data.length) {
    //       expect(data.length).toBe(4);
    //       expect(data.filter(el => el.bsddid === test_bsddid)[0].product_count).toBe(13);
    //       expect(data.filter(el => el.bsddid === test_bsddid)[0].last_count).not.toBe(null);
    //       expect(data.filter(el => el.bsddid === null).length).not.toBeGreaterThan(2);
    //     }
    //     done();
    //   })
    // });
    //
    // it('should check put request/ branch2', (done) =>{
    //   req.put({
    //     url: base_url + 'stock/' + timed_test_query,
    //     form: {
    //       product_count: 6,
    //       product_id : test_pid4
    //     }
    //   }, function (err, res) {
    //     if(err){
    //       fail(err.message);
    //       done();
    //     }
    //     expect(res).toBeTruthy();
    //     done();
    //   })
    // });
    //
    // it('should check put request/checking it happend' ,(done) =>{
    //   let date = moment().format('YYYY-MM-DD');
    //   req.get(base_url + 'stock/' + date + timed_test_query, (err, res)=> {
    //     if(err){
    //       fail(err.message);
    //       done();
    //     }
    //     let data = JSON.parse(res.body);
    //     expect(data.length);
    //     if(data.length) {
    //       expect(data.length).toBe(4);
    //       expect(data.filter(el => el.bsddid === null).length).not.toBeGreaterThan(1);
    //     }
    //     done();
    //   })
    // });
    //
    // it('should do nothing if a prep logs in',(done) =>{
    //   req.post({
    //     url: base_url + 'login' + timed_test_query,
    //     form: {
    //       username: 'sadrasalehi',
    //       password: '12345'
    //     }
    //   }, (error, response) => {
    //     if(error){
    //       fail(error.message);
    //       done();
    //     }
    //     expect(response.statusCode).toBe(200);
    //     done();
    //   })
    // });
    //
    // it('should do nothing if a prep logs in/ check it happened', done => {
    //   sql.test.branch_stock_delivery_date.select()
    //     .then((res)=>{
    //       expect(res).toBeTruthy();
    //       expect(res.filter(el=>el.branch_id === test_uid3).length).toBe(0);
    //       done();
    //     })
    //     .catch((err)=> {
    //       console.log(err.message);
    //       done()
    //     });
    // });



    afterEach((done) => {
      let dropOrNotExist = function (tableName) {
        return lib.helpers.dropOrNotExit(tableName, sql.test)
      }
        dropOrNotExist('last_login')
          .then(() => {
            return dropOrNotExist('branch_stock_delivery_date')
          })
          .then(()=> {
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

});


