/**
 * Created by mbr on 22/06/2017.
 */
const Product = require('../../lib/product.model');
const sql = require('../../sql');
const moment = require('moment');
const Price = require('../../lib/price.model');

describe('Price attribute for products', () => {
    let unit_id;
    let product_id;
    let product = new Product(true);
    let price_id;

    beforeAll((done) => {
        sql.test.units.create()                       //Create units table
            .then((res) => {
                return sql.test.products.create();
            })                       //Create products table
            .then((res) => {
                return sql.test.prices.create(); // create prices table
            })
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

    it('should set price for product and then load it by product_id', (done) => {
        var price = new Price(true); // true for test flag
        Price.test = true;
        price.insert(product_id, 30.20)
            .then((res) => {
                console.log(res);
                // sql.test.prices.select(price_id)
                Price.findPriceOfProduct(product_id)
                    .then((price) => {
                        console.log(price);
                        expect(price).toEqual('30.20');
                        done();
                    })
                    .catch((err) => {
                        fail(err.message);
                        done();
                    });
            })
            .catch((err) => {
                fail(err.message);
                done();
            });
    });

    it('should update price of a product', (done) => {
        Price.test = true;
        Price.setPriceOfProduct(product_id, 40.32)
            .then((res) => {
                expect(res).toBeDefined();
                Price.findPriceOfProduct(product_id)
                    .then((price) => {
                        console.log(price);
                        expect(price).toBe('40.32');
                        done();
                    })
                    .catch((err) => {
                        fail(err.message);
                        done();
                    });
            })
            .catch((err) => {
                fail(err.message);
                done();
            })

    });

    it('should insert a product with its price at the same time', (done) => {
        Price.test = true;
        let product_data = {
            prep_unit_id: unit_id,
            code: '1002',
            name: 'Chips',
            size: 17,
            measuring_unit: 'Kg',
            default_max: 3,
            default_min: 1,
            default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
            default_usage: 2,
            price: 25.12
        };
        product.insert(product_data)
            .then((prod_id) => {
                sql.test.products.getById({pid: prod_id})
                    .then((products) => {
                        let product = products[0];
                        expect(product.price.substring(1)).toBe('25.12');
                        done();
                    })
                    .catch((err) => {
                        fail(err.message);
                        done();
                    })
            })
            .catch((err) => {
                fail(err.message);
                done();
            })
    });

    it('should be able to add a product without price', (done) => {
        let product_data = {
            prep_unit_id: unit_id,
            code: '1003',
            name: 'Tomato',
            size: 10,
            measuring_unit: 'Kg',
            default_max: 3,
            default_min: 1,
            default_date_rule: 'FREQ=WEEKLY;BYDAY=MO,FR',
            default_usage: 2,
        };
        (new Product(true)).insert(product_data)
            .then((prod_id) => {
                sql.test.products.getByName({name: 'Tomato'})
                    .then((products) => {
                        let product = products[0];
                        expect(product.code).toBe('1003');
                        done();
                    })
                    .catch((err) => {
                        fail(err.message);
                        done();
                    })
            })
            .catch((err) => {
                fail(err.message);
                done();
            })
    });


    afterAll((done) => {
        sql.test.prices.drop()
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
