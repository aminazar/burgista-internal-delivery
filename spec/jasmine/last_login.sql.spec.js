/**
 * Created by Sareh on 2/19/2017.
 */
const env = require('../../env');
const sql = require('../../sql');

describe("Test 'last_login' table", () => {
  let test_uid;
  let test_last_login_lid =1 ;

  beforeAll((done) => {
    sql.test.units.create()
      .then(() => {
        return sql.test.last_login.create()
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Sareh salehi',
          username: 'sasalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Ali salehi',
          username: 'asalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Negar salehi',
          username: 'nsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Sadra salehi',
          username: 'sadsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then((res)=>{
        test_uid = res.uid;
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it("should throw an error if login_uid is NOT exist in units table",(done) => {
    sql.test.last_login.add({
      login_uid : 10,
      previous_login_date_time:null,
    })
    .then((res)=>{
      fail('this login_uid is NOT exist in units table!!');
      done();
    })
    .catch((err) => {
      return sql.test.last_login.select()
    })
    .then((res) => {
      expect(res.length).toBe(0);
      done();
    })
    .catch((err) => {
      console.log(err.message);
      fail(err.message);
      done();
    })
  });

  it("should delete 0 row from last_login table if user logins for the first time",(done) =>{
    sql.test.last_login.add({
      login_uid : 1,
      previous_login_date_time : null,
    })
    .then((res) => {
      test_last_login_lid = res.lid;
      return sql.test.last_login.get_login_uid({lid : test_last_login_lid});
    })
    .then((res) => {
      expect(res[0].login_uid).toBe(1);
      return sql.test.last_login.delete({login_uid : res[0].login_uid ,lid: test_last_login_lid})
    })
    .then((res) => {
      expect(res.length).toBe(0);
      return sql.test.last_login.select()
    })
    .then((res) => {
      expect(res.length).toBe(1);
      done();
    })
    .catch((err) => {
      console.log(err.message);
      fail(err.message);
      done();
    })
  });

  it("should add a new row to the table after successfull login", (done) => {
    sql.test.last_login.add({
      login_uid : test_uid,
      previous_login_date_time : null,
      })
      .then((res) => {
        return sql.test.last_login.select()
      })
      .then((res) => {
        expect(res.length).toBe(2);
        return sql.test.last_login.add({
          login_uid: test_uid-1,
          previous_login_date_time: null,
        })
      })
      .then((res) => {
        return sql.test.last_login.select()
      })
      .then((res) =>{
        expect(res.length).toBe(3);
        return sql.test.last_login.add({
          login_uid: test_uid-2,
          previous_login_date_time: null,
        })
      })
      .then((res) =>{
        return sql.test.last_login.select()
      })
      .then((res) => {
        expect(res.length).toBe(4);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it("should delete user all last logins(just 1 row) if there is after new login" ,(done) =>{
    sql.test.last_login.get_previous_login_date({
      login_uid : 4,
    })
    .then((res) =>{
      return sql.test.last_login.add({
        login_uid : 4,
        previous_login_date_time : res.length ? res[0].login_date_time : null,
      })
    })
    .then ((res) => {
      test_last_login_lid = res.lid;
      return sql.test.last_login.get_login_uid({lid : test_last_login_lid})
    })
    .then((res) => {
      expect(res[0].login_uid).toBe(4);
      return sql.test.last_login.delete({login_uid : res[0].login_uid ,lid: test_last_login_lid})
    })
    .then((res) => {
      expect(res.length).toBe(1);
      return sql.test.last_login.select()
    })
    .then((res)=>{
      expect(res.length).toBe(4);
      done();
    })
    .catch((err) => {
      console.log(err.message);
      fail(err.message);
      done();
    })
  });

  it("should add a new row to last_login table and delete all last exist login-dates just after successful login", (done) => {
    sql.test.units.add({
      name: 'mona pedram',
      username: 'mpedram',
      secret: 'qwerty',
      is_branch: false
    })
    .then((res)=>{
      expect(typeof res.uid).toBe('number');
      test_uid = res.uid;
      return sql.test.last_login.get_previous_login_date({
        login_uid: test_uid,
      })
    })
    .then((res) =>{
      return sql.test.last_login.add({
        login_uid : test_uid,
        previous_login_date_time : res.length ? res[0].login_date_time : null,
      })
    })
    .then((res) => {
      expect(typeof res.lid).toBe('number');
      test_last_login_lid = res.lid;
      return sql.test.last_login.get_login_uid({lid : test_last_login_lid})
    })
    .then((res) => {
      expect(res[0].login_uid).toBe(test_uid);
      return sql.test.last_login.delete({login_uid : res[0].login_uid ,lid: test_last_login_lid})
    })
    .then((res) => {
      expect(res.length).toBe(0);
      done();
    })
    .catch((err) => {
      console.log(err.message);
      fail(err.message);
      done();
    })
  });


  afterAll((done) => {
    if(test_last_login_lid) {
      sql.test.last_login.drop()
      .then(() => {
        if(test_uid) {
          sql.test.units.drop()
          .then(() => {
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
