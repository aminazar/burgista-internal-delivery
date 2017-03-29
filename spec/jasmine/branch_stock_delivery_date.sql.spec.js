const env = require('../../env');
const sql = require('../../sql');


describe("Test 'branch_stoke_delivery_date' table", () => {
  let test_uid1,test_uid2,test_uid3,test_uid4,test_pid1,test_pid2;

  beforeAll((done) => {
    //create units table
    sql.test.units.create()
      .then(() => {
        return sql.test.last_login.create()
      })//create last_login table
      .then(() => {
        return sql.test.units.add({
          name: 'Ali salehi',
          username: 'asalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })//add a new branch to table units
      .then((res) => {
        test_uid1= res.uid;
        return sql.test.units.add({
          name: 'Sareh salehi',
          username: 'sasalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })//add a new branch to table units
      .then((res) => {
        test_uid2= res.uid;
        return sql.test.units.add({
          name: 'Negar salehi',
          username: 'nsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })//add a new prep to table units
      .then((res) => {
        test_uid3= res.uid;
        return sql.test.units.add({
          name: 'Sadra salehi',
          username: 'sadsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })//add a new prep to table units
      .then((res)=>{
        test_uid4 = res.uid;
        return sql.test.products.create()
      })//get uid : 4 //create product table
      .then(() => {
        return sql.test.products.add({
          prep_unit_id : 3,
          code: 1011,
          name: 'apple',
          size: 2,
          measuring_unit : 'Kg',
          default_max: 10,
          default_min: 3,
          default_date_rule :'DTSTART=20170228T122842Z;INTERVAL=2;FREQ=WEEKLY;BYDAY=TU,FR',
          default_mon_multiple: 1,
          default_tue_multiple: 1,
          default_wed_multiple: 1,
          default_thu_multiple: 1,
          default_fri_multiple: 2,
          default_sat_multiple: 2,
          default_sun_multiple: 2,
          default_usage: 1
        })
      })//add a new product to table units
      .then((res) => {
        test_pid1 = res.pid;
        return sql.test.products.add({
          prep_unit_id : 3,
          code: 1012,
          name: 'orange',
          size: 3,
          measuring_unit : 'Kg',
          default_max: 20,
          default_min: 5,
          default_date_rule: 'DTSTART=20170228T132232Z;FREQ=WEEKLY;INTERVAL=1;BYDAY=TU,FR',
          default_mon_multiple: 2,
          default_tue_multiple: 2,
          default_wed_multiple: 1,
          default_thu_multiple: 1,
          default_fri_multiple: 1,
          default_sat_multiple: 1,
          default_sun_multiple: 1,
          default_usage: 1
        })
      })//add a new product to table units
      .then((res) => {
        test_pid2 = res.pid;
        return sql.test.branch_stock_delivery_date.create()
      })//create branch_stock_delivery_date table
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it('should pass a inevitable spec', (done) => {
    expect(true).toBe(true);
    done();
  });

  it('should show branch ID if a branch logs in', (done) => {
    return sql.test.last_login.get_previous_login_date({
      login_uid: test_uid2,
    })
      .then((res) => {
        return sql.test.last_login.add({
          login_uid: test_uid2,
          previous_login_date_time : res.length ? res[0].login_date_time : null,
        })
      })
      .then(() => {
        return sql.test.units.get_info_by_uid({
          uid: test_uid2
        })
      })
      .then((res) => {
        if(res[0].is_branch) {
          return sql.test.last_login.get_previous_login_date({
            login_uid: res[0].uid
          })
          .then((res) => {
            expect(res).toBeTruthy();
            done();
          })
        }
        else {
          console.log('user is not a branch');
          done();
        }
      })
      .catch((err) => {
        console.log(err.message);
        fail(err.message);
        done();
      });
  });

  it('should add a new row to the table', (done) =>{
    sql.test.branch_stock_delivery_date.add({
      product_id: 1,
      branch_id: test_uid2,
      counting_date: '2016-12-14',
      submission_time: null,
      min_stock: 2,
      product_count: null,
      real_delivery: null,
    })
      .then((res) => {
        expect(typeof res.bsddid).toBe('number');
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });


  // it('should NOT add a new row to the table if a prep_unit logs in', (done) =>{
  //   sql.test.last_login.get_previous_login_date({
  //     login_uid: test_uid3,
  //   })
  //   .then((res) =>{
  //     return sql.test.last_login.add({
  //       login_uid: res.login_uid,
  //       previous_login_date_time : res.length ? res[0].login_date_time : null,
  //     })
  //   })
  //   .then((res) =>{
  //
  //
  //   })
  // })

  afterAll((done) => {
    sql.test.last_login.drop()
      .then(() => {
        return sql.test.branch_stock_delivery_date.drop()
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
  });
});

// console.log('*************');
// console.log(res);
// console.log('*************');
