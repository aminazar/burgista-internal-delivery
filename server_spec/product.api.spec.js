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

describe("REST API", ()=> {

  describe("product", () => {
    let uid;
    let pid;
    let bid;
    let anotherPid;
    let adminUid;
    let u;
    let p;
    let tearDown = false;
    let setup = true;

    beforeEach((done) => {
      if(setup){
        lib.helpers.createOrExist('units', sql.test)
          .then ((res)=>{
            return lib.helpers.createOrExist('last_login', sql.test);
        })                          //Create last_login table
          .then((res) => {
            return lib.helpers.createOrExist('products', sql.test);
          })                        //Create products table
          .then((res) => {
            return lib.helpers.createOrExist('branch_stock_rules', sql.test);
          })                        //Create branch_stock_rules table
          .then((res) => {
            return lib.helpers.createOrExist('branch_stock_delivery_date', sql.test);
          })                        //Create branch_stock_delivery_date
          .then((res) => {
            let branch = new lib.Unit(true);

            branch.name = 'Baker Street';
            branch.username = 'bk';
            branch.password = '123';
            branch.is_branch = true;

            return branch.save();
          })                        //Add an unit (branch unit)
          .then((res) => {
            bid = res;

            u = new lib.Unit(true);
            u.name = 'Main Depot';
            u.username = 'md';
            u.password = '123';
            u.is_branch = false;

            return u.save();
          })                        //Add another unit (prep unit)
          .then((res) => {
            uid = res;
            p = new lib.Product(true);

            p.name = 'Frying oil';
            p.code = 'fo01';
            p.prep_unit_id = uid;
            p.size = 10;
            p.measuring_unit = 'Kg';
            p.default_max = 12;
            p.default_min = 11;
            p.default_date_rule = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';

            return p.save();
          })                        //Add a product
          .then((res) => {
            pid = res;

            let product = new lib.Product(true);
            product.name = 'Meat';
            product.code = 'm01';
            product.prep_unit_id = uid;
            product.size = 20;
            product.measuring_unit = 'Kg';
            product.default_max = 5;
            product.default_min = 2;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';

            return product.save();
          })                        //Add another product
          .then((res) => {
            anotherPid = res;

            let a = new lib.Unit(true);
            a.name = 'Admin';
            a.username = 'admin';
            a.password = 'admin';
            a.is_branch = false;

            return a.save();
          })                        //Add admin user (into units table)
          .then((res) => {
            adminUid = res;
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

    it("response to 'logincheck'", (done) => {
      request.post({
        url: base_url + 'logincheck' + test_query,
        form: {username: 'admin', password: 'admin'}
      }, function (error, response) {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("doesn't save product when user is not admin", (done) => {
      request.put({
        url: base_url + 'product' + test_query,
        form: {
          name: 'Ketchup Sauce',
          code: 'ks01',
          prep_unit_id: uid,
          size: 10,
          measuring_unit: 'Packs',
          default_max: 10,
          default_min: 8,
          default_usage: 2,
          default_date_rule: 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1'
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it("admin should be able to login", (done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'admin',
          password: 'admin'
        }
      }, (error, response) => {
        if(error){
          console.log(error.message);
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      })
    });

    it("should get all products (without overridden values)", (done) => {
      req.get({
        url: base_url + 'product' + test_query
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }
        console.log(response.body);
        let data = JSON.parse(response.body);
        expect(data.length).toBe(2);
        expect(response.statusCode).toBe(200);
        done();
      })
    });

    it("should a branch can login", (done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'bk',
          password: '123'
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

    it("should add a new override on a specific product", (done) => {
      req.post({
        url: base_url + 'override/' + pid + test_query + '&uid=' + bid ,
        form: {
          max: 20,
          mon_multiple: 2
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products (with overridden values)", (done) => {
      req.get({url: base_url + 'override' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(2);
        expect(data[0].isOverridden).toBe(true);
        expect(data[0].default_max).toBe(20);
        expect(parseInt(data[0].default_mon_multiple, 10)).toBe(2);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should update a product overridden values", (done) => {
      req.post({
        url: base_url + 'override/' + pid + test_query + '&uid=' + bid,
        form: {
          max: 30,
          sun_multiple: 10
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

    it("should get all products with overridden values", (done) => {
      req.get({url: base_url + 'override' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(2);
        expect(data[0].isOverridden).toBe(true);
        expect(data[0].name).toBe('Frying oil');
        expect(data[0].default_max).toBe(30);
        expect(parseInt(data[0].default_mon_multiple), 10).toBe(2);
        expect(parseInt(data[0].default_sun_multiple), 10).toBe(10);
        done();
      })
    });

    it("admin should be able to login", (done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'admin',
          password: 'admin'
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

    it("should delete a product from products table", (done) => {
      req.delete({url: base_url + 'product/' + pid + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products (without overridden values)", (done) => {
      req.get({url: base_url + 'product' + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].isOverridden).toBe(undefined);
        done();
      })
    });

    it("should a branch can login", (done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'bk',
          password: '123'
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

    it("should add a new override on a specific product", (done) => {
      req.post({
        url: base_url + 'override/' + anotherPid + test_query + '&uid=' + bid ,
        form: {
          max: 20,
          mon_multiple: 2
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products with overridden values", (done) => {
      req.get({url: base_url + 'override' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].isOverridden).toBe(true);
        expect(data[0].name).toBe('Meat');
        expect(data[0].default_max).toBe(20);
        expect(parseInt(data[0].default_mon_multiple, 10)).toBe(2);
        done();
      })
    });

    it("should delete a product overridden from branch_stock_rules table", (done) => {
      req.delete({url: base_url + 'override/' + anotherPid + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.name).toBe('Meat');
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products with overridden values (but there is no overridden values)", (done) => {
      req.get({url: base_url + 'override' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].isOverridden).toBe(undefined);
        expect(data[0].default_max).toBe(5);
        expect(parseInt(data[0].default_mon_multiple, 10)).toBe(1);
        done();
      })
    });

    it("should raise error when updating a product without admin user and no uid", (done) => {
      req.post({
        url: base_url + 'product/' + anotherPid + test_query,
        form: {
          default_usage: 3
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(403);
        done();
      })
    });

    it("should raise error when deleting a product without admin user and no uid", (done) => {
      req.delete({url: base_url + 'product/' + anotherPid + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(403);
        done();
      })
    });

    it("should raise error when selecting products without admin user and no uid", (done) => {
      req.get({url: base_url + 'product' + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(403);
        done();
      })
    });

    it("admin should be able to login", (done) => {
      req.post({
        url: base_url + 'login' + test_query,
        form: {
          username: 'admin',
          password: 'admin'
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

    it("should update main product (not overridden values)", (done) => {
      req.post({
        url: base_url + 'product/' + pid + test_query,
        form: {
          default_max: 2,
          default_min: 1
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

    it("should get all products with main value (not overridden values)", (done) => {
      req.get({url: base_url + 'product' + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].isOverridden).toBe(undefined);
        expect(data[0].default_max).toBe(5);
        expect(data[0].default_min).toBe(2);
        done();
      });
    });

    it("admin should be able to add a product to products table", (done) => {
      req.put({
        url: base_url + 'product' + test_query,
        form: {
          name: 'Ketchup Sauce',
          code: 'ks01',
          prep_unit_id: uid,
          size: 10,
          measuring_unit: 'Packs',
          default_max: 10,
          default_min: 8,
          default_usage: 2,
          default_date_rule: 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1'
        }
      }, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products", (done) => {
      req.get({url: base_url + 'product' + test_query}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(2);
        expect(data[1].name).toBe('Ketchup Sauce');
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('tear down', () => {
      tearDown = true;
    });

    afterEach((done) => {
      let dropOrNotExist = function (tableName) {
        return lib.helpers.dropOrNotExit(tableName, sql.test)
      };
      if(tearDown){
        dropOrNotExist('last_login')
          .then(() => {
            return dropOrNotExist('branch_stock_rules')
          })
          .then(() => {
            return dropOrNotExist('branch_stock_delivery_date')
          })
          .then(() => {
            return dropOrNotExist('products');
          })
          .then(() => {
            return dropOrNotExist('units');
          })
          .then(() => {
            done();
          })
          .catch((err) => {
            console.log(err.message);
            done();
          })
      }
      else
        done();
    });
  })
});