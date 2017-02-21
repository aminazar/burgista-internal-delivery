/**
 * Created by Ali on 2/18/2017.
 */

const env = require('../../env');
const sql = require('../../sql');

describe("Test 'products' table", () => {
  let unit_id;
  let product_id;

  beforeAll((done) => {
    //First should create units table and add new unit to it (because products table has FK to units table)
    sql.test.units.create()
      .then(() => {
        return sql.test.products.create();
      })
      .then(() => {
        return sql.test.units.add({
          name: 'Baker Street',
          username: 'JohnSmith',
          secret: '123',
          is_branch: true
        });
      })
      .then((res) => {
        unit_id = res.uid;
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });

  it('should add a new product to table (with default_usage value)', (done) => {
    sql.test.products.add({
      prep_unit_id: unit_id,
      code: 'FO01',
      name: 'Frying Oil',
      size: 17,
      measuring_unit: 'Kg',
      default_max: 3,
      default_min: 1,
      default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
      default_mon_multiple: 2,
      default_usage: 2
    })
      .then((res) => {
        expect(typeof res.pid).toBe('number');
        product_id = res.pid;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should add a new product to table (without default_usage value)', (done) => {
    sql.test.products.add({
      prep_unit_id: unit_id,
      code: 'KS01',
      name: 'Ketchup Sauce',
      size: 10,
      measuring_unit: 'Kg',
      default_max: 5,
      default_min: 3,
      default_date_rule: 'FREQ=WEEKLY;BYDAY=TU'
    })
      .then((res) => {
        expect(typeof res.pid).toBe('number');
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should get last product inserted', (done) => {
    sql.test.products.getByName({name: 'Ketchup Sauce'})
      .then((res) => {
        expect(res[0].default_mon_multiple).toBe(1);
        expect(res[0].default_usage).toBe(1);
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it('should get all products related to specific unit (By unit id)', (done) => {
    let tempUnitId = 0;

    //First add new unit and then add new product related to this unit id
    sql.test.units.add({
      name: 'Piccadilly',
      username: 'JackBlack',
      secret: '987',
      is_branch: false
    })    //Add new unit
      .then((res) => {
        tempUnitId = res.uid;
        expect(res).toBeTruthy();
        return sql.test.products.add({
          prep_unit_id: tempUnitId,
          code: 'MS01',
          name: 'Mayonnaise Sauce',
          size: 20,
          measuring_unit: 'Kg',
          default_max: 5,
          default_min: 3,
          default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR'
        });
      })  //Add new product
      .then((res) => {
        return sql.test.products.getByUnitId({prep_unit_id: tempUnitId});
      })
      .then((res) => {
        expect(res.length).toBe(1);
        expect(res[0].code).toBe('MS01');
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should get all products from table', (done) => {
    sql.test.products.select()
      .then((res) => {
        expect(res.length).toBe(3);
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should update a specific row', (done) => {
    sql.test.products.update({size: 12}, product_id)
      .then((res) => {
        expect(res).toBeTruthy();
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should delete a specific row', (done) => {
    sql.test.products.delete(product_id)
      .then((res) => {
        expect(res).toBeTruthy();
        return sql.test.products.select();
      })
      .then((res) => {
        expect(res.length).toBe(2);
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  afterAll((done) => {
    if(product_id){
      sql.test.products.drop()
        .then(() => {
          return sql.test.units.drop();
        })
        .then(() => done())
        .catch((err) => {
          console.log(err.message);
          done();
        });
    }
    else
      done();
  });
});