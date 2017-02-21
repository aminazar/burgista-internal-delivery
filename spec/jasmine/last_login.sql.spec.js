/**
 * Created by Sareh on 2/19/2017.
 */
const env = require('../../env');
const sql = require('../../sql');

describe("Test 'last_login' table", () => {
  let test_uid;
  let test_last_login_uid;
  let date = new Date();

  beforeAll((done) => {
    sql.test.units.create()
      .then(() => {
        return sql.test.last_login.create()
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Reza razavi',
          username: 'rrazavi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then((res) => {
        return sql.test.units.add({
          name: 'Sahar salehi',
          username: 'ssalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })
      .then((res) => {
        return sql.test.units.add({
          name: 'Negar salehi',
          username: 'nsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then((res) => {
        test_uid = res.uid;
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });


  it("Should add a new row to the table after successfull login", (done) => {
    sql.test.last_login.add({
      login_uid : test_uid,
      login_date_time : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      })
      .then((res) => {
        return sql.test.last_login.select()
      })
      .then((res) => {
        expect(res.length).toBe(1);
        return sql.test.last_login.add({
          login_uid: test_uid-1,
          login_date_time: date.getFullYear() + '-' + (date.getMonth() + 2) + '-' + date.getDate()
        })
      })
      .then((res) => {
        return sql.test.last_login.select()
      })
      .then((res) =>{
        expect(res.length).toBe(2);
        return sql.test.last_login.add({
          login_uid: test_uid -2,
          login_date_time: date.getFullYear() + '-' + (date.getMonth() + 2) + '-' + date.getDate()
        })
      })
      .then((res) =>{
        test_last_login_uid = res.uid;
        return sql.test.last_login.select()
      })
      .then((res) => {
        expect(res.length).toBe(3);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it("Should delete user all last logins if there is after new login" ,(done) =>{
    sql.test.last_login.add({
      login_uid : 3,
      login_date_time : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    })
    .then ((res) => {
      test_uid = res.uid;
      return sql.test.last_login.get_login_uid({uid : test_uid})
    })
    .then((res) => {
      expect(res[0].login_uid).toBe(3);
      return sql.test.last_login.delete({login_uid : res[0].login_uid , uid : test_uid})
    })
    .then(() => {
      return sql.test.last_login.select()
    })
    .then((res)=>{
      expect(res.length).toBe(3);
      done();
    })
    .catch((err) => {
      console.log(err.message);
      fail(err.message);
      done();
    })
  });

  afterAll((done) => {
    if(test_last_login_uid) {
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
