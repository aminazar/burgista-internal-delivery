/** Created by 305-2 on 3/29/2017.**/
const request = require("request");
const base_url = "http://localhost:3000/api/";
const test_query = '?test=tEsT';
const lib = require('../lib');
const sql = require('../sql');
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
    let setup = true;
    let tearDown = false;
    let test_uid1,test_uid2,test_uid3,test_uid4,test_pid1,test_pid2,test_pid3,adminUid;
    let override_1 = {
      date_rule: 'DTSTART=20170303;FREQ=WEEKLY;INTERVAL=1;BYDAY=SA,TU',
      usage: 2,
    };
    let override_2 = {
      date_rule: 'DTSTART=20170303;FREQ=DAILY;INTERVAL=3',
      usage: 2,
    };

    beforeEach((done) => {
      if(setup){
        sql.test.units.create() //create units table
        .then ((res)=>{
          return sql.test.last_login.create();
        })//Create last_login table
        .then((res) => {
          return sql.test.products.create();
        })//Create products table
        .then((res) => {
          return sql.test.branch_stock_rules.create();
        })//Create branch_stock_rules table
        .then((res) => {
          return sql.test.branch_stock_delivery_date.create();
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
      }
      else{
        done();
      }
    });

    it('should pass a inevitable spec', (done) => {
      expect(true).toBe(true);
      done();
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

    it('should a branch can login',(done) => {
      req.post({
        url: base_url + 'login' + test_query,
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
        done();
      })
    });

    it('should show correct row number of units & last_login & branch_stock_delivery_date table/2', done => {
      sql.test.units.select()
        .then((res) => {
          expect(res.length).toBe(4);
          return sql.test.last_login.select()
        })
        .then((res) => {
          expect(res.length).toBe(1);
          return sql.test.branch_stock_delivery_date.select()
        })
        .then((res) =>{
          expect(res.length).toBe(3);
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

    it('should a branch can login',(done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'sarehsalehi',
          password: '12345'
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }
        expect(response.statusCode).toBe(200);
        done();
      })
    });

    it('should show correct row number of units & last_login & branch_stock_delivery_date table/3', done => {
      sql.test.units.select()
        .then((res) => {
          expect(res.length).toBe(4);
          return sql.test.last_login.select()
        })
        .then((res) => {
          expect(res.length).toBe(2);
          return sql.test.branch_stock_delivery_date.select()
        })
        .then((res) =>{
          expect(res.length).toBe(5);
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

    it('should get related rows of BSDD table by get request/(related rows to branch 2)' ,(done) =>{
      let date = 20170329;
      req.get(base_url + 'stock/' + date + test_query, (err, res)=> {
        if(err){
          fail(err.message);
          done();
        }
        let data = JSON.parse(res.body);
        expect(data.length).toBe(3);
        expect(data.filter(el=>el.bsddid === null).length).toBe(1);
        console.log(data);
        done();
      })
    });


    // it('should NOT add a row to the table if a prep unit logs in', (done) =>{
    //
    // });

    // it("should show valid user", done => {
    //   req.get(base_url + 'validUser' + test_query, (err, res) => {
    //     expect(res).toBeTruthy();
    //     done();
    //   });
    // });

    it('tear down', () => {
      tearDown = true;
    });

    afterEach((done) => {
      if(tearDown){
      sql.test.last_login.drop()
        .then(() => {
          return sql.test.branch_stock_delivery_date.drop()
        })
        .then(()=> {
          return sql.test.branch_stock_rules.drop()
        })
        .then(() => {
          return sql.test.products.drop()
        })
        .then(() => {
          return sql.test.units.drop()
        })
        .then(() =>{
          done();
        })
        .catch((err) => {
          console.log(err.message);
          fail(err.message);
          done();
        });
      }
      else
        done();
    });
  });

});


