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
  describe("root", ()=> {
    it("returns 'respond with a resource'", done => {
      request.get(base_url, function (error, response) {
        expect(response.body).toBe("respond with a resource");
        done();
      })
    });
  });

  describe("unit", ()=> {
    let branchUid;
    let uid;
    let adminUid;
    let u;
    let a;
    let teardown = false;
    let setup = true;

    beforeEach(done=> {
      if (setup) {
        u = new lib.Unit(true);
        u.username = 'amin';
        u.password = 'test';
        u.name = 'amin';
        u.is_branch = false;
        sql.test.units.create()
          .then(() => {
            setup = false;
            return u.save();
          })
          .then(id => {
            uid = id;
            a = new lib.Unit(true);
            a.username = 'Admin';
            a.password = 'atest';
            a.name = '';
            a.is_branch = false;
            return a.save();
          })
          .then(aid=> {
            adminUid = aid;

            let b = new lib.Unit(true);
            b.name = 'Baker Street';
            b.username = 'bk';
            b.password = '123';
            b.is_branch = true;

            return b.save();
          })
          .then(bid => {
            branchUid = bid;
            done();
          })
          .catch(err => {
            console.log(err.message);
            done();
          });
      }
      else {
        done();
      }
    });

    it("responds to 'loginCheck'", done => {
      request.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'amin', password: 'test'}
      }, function (error, response) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("responds to incorrect login unit", done => {
      request.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'ami', password: 'tes'}
      }, function (error, response) {
        expect(response.statusCode).toBe(400);
        done();
      });
    });

    it("responds to incorrect login password", done => {
      request.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'amin', password: 'tes'}
      }, function (error, response) {
        expect(response.statusCode).toBe(401);
        done();
      })
    });

    it("doesn't save a new unit if it is not admin", done => {
      request.put({
        url: base_url + 'unit' + test_query,
        form: {username: 'amin', password: 'tes'}
      }, function (err, res) {
        expect(res.statusCode).toBe(403);
        done();
      });
    });

    it("logins as admin", done => {
      req.post({url: base_url + 'login' + test_query, form: {username: 'admin', password: 'atest'}}, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to list all units except admin user", done => {
      req.get(base_url + 'unit' + test_query, (err, res)=> {
        if (resExpect(res, 200)) {
          let data = JSON.parse(res.body);
          expect(data.length).toBe(2);
          expect(data.map(r=>r.uid)).toContain(uid);
          expect(data.map(r=>r.username)).toContain('bk');
        }
        done();
      })
    });

    it("allows admin to list all prep units (except admin user)", done => {
      req.get(base_url + 'unit' + test_query + '&isBranch=false', (err, res) => {
        if(resExpect(res, 200)) {
          let data = JSON.parse(res.body);
          expect(data.length).toBe(1);
          expect(data.map(r => r.is_branch)).toContain(false);
          expect(data.map(r => r.is_branch)).not.toContain(true);
        }
        done();
      });
    });

    it("allows admin to update a username", done => {
      req.post({url: base_url + 'unit/' + uid + test_query, form: {username: 'aminazar'}}, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to update a username - checking that update happened", done => {
      req.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'aminazar', password: 'test'}
      }, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to update a password", done => {
      req.post({url: base_url + 'unit/' + uid + test_query, form: {password: 'test2'}}, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to update a password - checking that update happened", done => {
      req.post({
        url: base_url + 'loginCheck' + test_query,
        form: {username: 'aminazar', password: 'test2'}
      }, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to update both username and password", done => {
      req.post({
        url: base_url + 'unit/' + uid + test_query,
        form: {username: 'amin2', password: 'test3'}
      }, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to update both username and password - checking that update happened", done => {
      req.post({url: base_url + 'loginCheck' + test_query, form: {username: 'amin2', password: 'test3'}}, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      })
    });

    it("allows admin to delete a unit", done => {
      req.delete({
        url: base_url + 'unit/' + uid + test_query,
        form: {username: 'amin2', password: 'test3'}
      }, (err, res)=> {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("allows admin to delete a user - check it happened", done => {
      req.get(base_url + 'unit' + test_query, (err, res)=> {
        if (resExpect(res, 200)) {
          let data = JSON.parse(res.body);
          expect(data.length).toBe(1);
          expect(data[0].uid).toBe(branchUid);
          expect(data[0].username).toBe('bk');
        }
        done();
      })
    });

    it("allows admin to add a new unit", done => {
      req.put({
        url: base_url + 'unit' + test_query,
        form: {username: 'ali', password: 'tes', name: 'ali', is_branch: true}
      }, function (err, res) {
        if (resExpect(res, 200)) {
          uid = JSON.parse(res.body);
          expect(uid).toBeTruthy();
        }
        done();
      });
    });

    it("allows admin to add a new unit - checking it happened", done => {
      req.get(base_url + 'unit' + test_query, (err, res)=> {
        if (resExpect(res, 200)) {
          let data = JSON.parse(res.body);
          expect(data.length).toBe(2);
          expect(data.map(r => r.username)).toContain('ali');
          expect(data.map(r => r.uid)).toContain(uid);
        }
        done();
      });
    });

    it("logs out a unit", done => {
      req.get(base_url + 'logout' + test_query, (err, res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("logs out a unit - checking it happened", done => {
      req.get(base_url + 'unit' + test_query, (err, res)=> {
        expect(res.statusCode).toBe(403);
        done();
      });
    });

    it("tears down", ()=> {
      teardown = true;
      expect(teardown).toBeTruthy();
    });

    afterEach((done)=> {
      if (teardown)
        sql.test.units.drop().then(()=>done()).catch(err=> {
          console.log(err.message);
          done()
        });
      else done();
    });
  });

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
        sql.test.units.create()
          .then((res) => {
            return sql.test.products.create();
          })                        //Create products table
          .then((res) => {
            return sql.test.branch_stock_rules.create();
          })                        //Create branch_stock_rules table
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
            a.username = 'Admin';
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
        url: base_url + 'product/' + pid + test_query + '&uid=' + bid ,
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
      req.get({url: base_url + 'product' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(2);
        expect(data[0].default_max).toBe(20);
        expect(data[0].default_mon_multiple).toBe(2);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should update a product overridden values", (done) => {
      req.post({
        url: base_url + 'product/' + pid + test_query + '&uid=' + bid,
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
      req.get({url: base_url + 'product' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(2);
        expect(data[0].name).toBe('Frying oil');
        expect(data[0].default_max).toBe(30);
        expect(data[0].default_mon_multiple).toBe(2);
        expect(data[0].default_sun_multiple).toBe(10);
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
        url: base_url + 'product/' + anotherPid + test_query + '&uid=' + bid ,
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
      req.get({url: base_url + 'product' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].name).toBe('Meat');
        expect(data[0].default_max).toBe(20);
        expect(data[0].default_mon_multiple).toBe(2);
        done();
      })
    });

    it("should delete a product overridden from branch_stock_rules table", (done) => {
      req.delete({url: base_url + 'product/' + anotherPid + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("should get all products with overridden values (but there is no overridden values)", (done) => {
      req.get({url: base_url + 'product' + test_query + '&uid=' + bid}, (error, response) => {
        if(error){
          fail(error.message);
          done();
        }

        let data = JSON.parse(response.body);

        expect(data.length).toBe(1);
        expect(data[0].default_max).toBe(5);
        expect(data[0].default_mon_multiple).toBe(1);
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

        console.log(data);

        expect(data.length).toBe(1);
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
      if(tearDown){
        sql.test.branch_stock_rules.drop()
          .then(() => {
            return sql.test.products.drop();
          })
          .then(() => {
            return sql.test.units.drop();
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