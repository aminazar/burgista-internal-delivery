/**
 * Created by Amin on 06/03/2017.
 */
const env = require('../../env');
const sql = require('../../sql');

describe("Branch Stock Delivery Date Model")
{
  let prep_uid, branch_id_1, branch_id_2, product_id_1, product_id_2;
  beforeAll((done) => {
    sql.test.units.create()
      .then(() => {
        return sql.test.last_login.create()
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Ali salehi',
          username: 'asalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })
      .then( res => {
        branch_id_1 = res.uid;
        return sql.test.units.add({
          name: 'Sareh salehi',
          username: 'sasalehi',
          secret: 'qwerty',
          is_branch: true
        })
      })
      .then(res => {
        branch_id_2 = res.uid;
        return sql.test.units.add({
          name: 'Sadra salehi',
          username: 'sadsalehi',
          secret: 'qwerty',
          is_branch: false
        })
      })
      .then((res) => {
        prep_uid = res.uid;
      })
      .then(() => {
        return sql.test.products.create()
      })
      .then(() => {
        return sql.test.products.add({
          prep_unit_id: prep_uid,
          code: 1011,
          name: 'apple',
          size: 2,
          measuring_unit: 'Kg',
          default_max: 10,
          default_min: 3,
          default_date_rule: 'DTSTART=20170228T122842Z;INTERVAL=2;FREQ=WEEKLY;BYDAY=TU,FR',
          default_mon_multiple: 1,
          default_tue_multiple: 1,
          default_wed_multiple: 1,
          default_thu_multiple: 1,
          default_fri_multiple: 2,
          default_sat_multiple: 2,
          default_sun_multiple: 2,
          default_usage: 3
        })
      })
      .then(res => {
        product_id_1 = res.pid;
        return sql.test.products.add({
          prep_unit_id: prep_uid,
          code: 1012,
          name: 'orange',
          size: 3,
          measuring_unit: 'Kg',
          default_max: 20,
          default_min: 5,
          default_date_rule: 'DTSTART=20170228T132232Z;FREQ=DAILY;INTERVAL=3',
          default_mon_multiple: 2,
          default_tue_multiple: 2,
          default_wed_multiple: 1,
          default_thu_multiple: 1,
          default_fri_multiple: 1,
          default_sat_multiple: 1,
          default_sun_multiple: 1,
          default_usage: 1
        })
      })
      .then(res => {
        product_id_2 = res.pid;
        let product = new Product();
        product.update({
          default_date_rule: 'DTSTART=20170228T132232Z;FREQ=DAILY;INTERVAL=2',
          default_usage: 2,
        }, product_id_2, 'admin', branch_id_1)
      })
      .then(res => {
        //TODO: remove it after first run
        console.log('result of product override', res);
        return sql.test.branch_stock_delivery_date.create()
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
}