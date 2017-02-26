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
});