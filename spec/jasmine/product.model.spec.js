/**
 * Created by Ali on 2/20/2017.
 */

const Product = require('../../lib/product.model');
const sql = require('../../sql');

describe('Product model', () => {
  let unit_id;
  let product_id;
  let product = new Product(true);

  beforeAll((done) => {
    sql.test.units.create()                       //Create units table
      .then((res) => {
        return sql.test.products.create();
      })                       //Create products table
      .then((res) => {
        return sql.test.branch_stock_rules.create();
      })                       //Create branch_stock_rules table
      .then((res) => {
        return sql.test.units.add({
          name: 'Baker Street',
          username: 'JohnSmith',
          secret: '123',
          is_branch: true
        })
      })                       //Add a unit to units table
      .then((res) => {
        unit_id = res.uid;
        return sql.test.products.add({
          prep_unit_id: unit_id,
          code: 'FO01',
          name: 'Frying Oil',
          size: 17,
          measuring_unit: 'Kg',
          default_max: 3,
          default_min: 1,
          default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
          default_usage: 2
        });
      })                       //Add a product to products table
      .then((res) => {
        product_id = res.pid;
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      })
  });

  it('should add a new product', (done) => {
    const data = {
      prep_unit_id: unit_id,
      code: 'KS01',
      name: 'Ketchup Sauce',
      size: 10,
      measuring_unit: 'Kg',
      default_max: 2,
      default_min: 1,
      default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR'
    };

    product.insert(data)
      .then((res) => {
        expect(res).toBeTruthy();
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it('should select all products', (done) => {
    Product.test = true;
    Product.select('admin')
      .then((res) => {
        expect(res.length).toBe(2);
        expect(res.filter((p) => p.isOverridden === true).length).toBe(0);
        Product.test = false;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should override a product', (done) => {
    const data = {
      max: 5,
      min: 2,
      mon_multiple: 2,
      usage: 1
    };

    product.update(data, product_id, 'JohnSmith' ,unit_id)
      .then((res) => {
        expect(res).toBeTruthy();
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  it('should select all products (with overridden values)', (done) => {
    Product.test = true;
    Product.select('JohnSmith', unit_id)
      .then((res) => {
        expect(res[0].isOverridden).toBe(true);
        expect(res[0].default_max).toBe(5);
        expect(parseInt(res[0].default_mon_multiple, 10)).toBe(2);
        Product.test = false;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      })
  });

  afterAll((done) => {
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
  });
});