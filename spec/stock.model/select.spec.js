const env = require('../../env');
const sql = require('../../sql');
const moment = require('moment');
const UnitModel = require('../../lib/unit.model');
const StockModel = require('../../lib/stock.model');
let products = [{
        pid: 100,
        prep_unit_id: 11,
        code: 1000,
        name: 'apple',
        size: 2,
        measuring_unit: 'Kg',
        default_max: 3,
        default_min: 2,
        default_date_rule: 'DTSTART:20170912T091308Z\nRRULE:FREQ=DAILY;INTERVAL=1',
        default_mon_multiple: 2,
        default_tue_multiple: 2,
        default_wed_multiple: 2,
        default_thu_multiple: 2,
        default_fri_multiple: 2,
        default_sat_multiple: 2,
        default_sun_multiple: 2,
        default_usage: 1,
        setDefaultMin: function(value) {
            this['default_min'] = value;
        },
        setDefaultMax: function(value) {
            this['default_max'] = value;
        },
        set_default_x_multiple: function (value) {
            this.default_mon_multiple = value;
            this.default_tue_multiple = value;
            this.default_wed_multiple = value;
            this.default_thu_multiple = value;
            this.default_sun_multiple = value;
            this.default_sat_multiple = value;
            this.default_fri_multiple = value;
        },
        set_default_usage: function(value) {
            this['default_usage'] = value;
        },
        get: function () {
            const obj = {};
            for (const key in this) {
                if (this.hasOwnProperty(key)) {
                    const value = this[key];
                    if (typeof value !== 'function') {
                        obj[key] = value;
                    }
                }
            }
            return obj;
        }
    },
    {
        pid: 110,
        prep_unit_id: 11,
        code: 2000,
        name: 'orange',
        size: 3,
        measuring_unit: 'Kg',
        default_max: 1,
        default_min: 1,
        default_date_rule: 'RRULE:INTERVAL=1;FREQ=DAILY',
        default_mon_multiple: 1,
        default_tue_multiple: 1,
        default_wed_multiple: 1,
        default_thu_multiple: 1,
        default_fri_multiple: 1,
        default_sat_multiple: 1,
        default_sun_multiple: 1,
        default_usage: 9,
        set_default_usage: function(value) {
            this['default_usage'] = value;
        },
        setDefaultMin: function(value) {
            this['default_min'] = value;
        },
        setDefaultMax: function(value) {
            this['default_max'] = value;
        },
        set_default_x_multiple: function (value) {
            this.default_mon_multiple = value;
            this.default_tue_multiple = value;
            this.default_wed_multiple = value;
            this.default_thu_multiple = value;
            this.default_sun_multiple = value;
            this.default_sat_multiple = value;
            this.default_fri_multiple = value;
        },
        get: function () {
            const obj = {};
            for (const key in this) {
                if (this.hasOwnProperty(key)) {
                    const value = this[key];
                    if (typeof value !== 'function') {
                        obj[key] = value;
                    }
                }
            }
            return obj;
        }
    }
];
let branch_stock_rules = [{
    pid: 100,
    max: null,
    min: null,
    date_rule: null,
    mon_multiple: 7,
    tue_multiple: 7,
    wed_multiple: 7,
    thu_multiple: 7,
    fri_multiple: 7,
    sat_multiple: 7,
    sun_multiple: 7,
    usage: null,
    uid: 22,
    set_usage: function(value) {
        this['usage'] = value;
    },
    setMin: function(value) {
        this['min'] = value;
    },
    setMax: function(value) {
        this['max'] = value;
    },
    set_x_multiple: function (value) {
        this.mon_multiple = value;
        this.tue_multiple = value;
        this.wed_multiple = value;
        this.thu_multiple = value;
        this.sun_multiple = value;
        this.sat_multiple = value;
        this.fri_multiple = value;
    },
    get: function () {
        const obj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const value = this[key];
                if (typeof value !== 'function') {
                    obj[key] = value;
                }
            }
        }
        return obj;
    }
}, {
    pid: 110,
    max: 8,
    min: 7,
    date_rule: 'DTSTART:20170912T091308Z\nRRULE:FREQ=DAILY;INTERVAL=1',
    mon_multiple: 3,
    tue_multiple: 3,
    wed_multiple: 3,
    thu_multiple: 3,
    fri_multiple: 3,
    sat_multiple: 3,
    sun_multiple: 3,
    usage: 1,
    uid: 22,
    set_usage: function(value) {
        this['usage'] = value;
    },
    setMin: function(value) {
        this['min'] = value;
    },
    setMax: function(value) {
        this['max'] = value;
    },
    set_x_multiple: function (value) {
        this.mon_multiple = value;
        this.tue_multiple = value;
        this.wed_multiple = value;
        this.thu_multiple = value;
        this.sun_multiple = value;
        this.sat_multiple = value;
        this.fri_multiple = value;
    },
    get: function () {
        const obj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const value = this[key];
                if (typeof value !== 'function') {
                    obj[key] = value;
                }
            }
        }
        return obj;
    }
}];
let units = [{
    uid: 11,
    name: 'main prep',
    username: 'prep',
    secret: '123456',
    is_branch: false,
    is_kitchen: true
}, {
    uid: 22,
    name: 'finchley',
    username: 'fin-prep',
    secret: '123456',
    is_branch: true,
    is_kitchen: true
}];
describe("select", () => {

    beforeEach(async done => {
        try {
            await sql.test.db.dropSchema();
            await sql.test.units.create();
            await sql.test.last_login.create();
            await sql.test.products.create();
            await sql.test.branch_stock_rules.create();
            await sql.test.branch_stock_delivery_date.create();

            done();
        } catch (err) {
            console.error(err);
            fail(err.message);
            done();
        }
    });

    it('If a product has to be counted between two logins each day, it will only show the last day', async function (done) {
        try {
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            expect(result['length']).toBe(2);
            const result_product_100 = result.find(el => el['pid'] === 100);
            const result_product_110 = result.find(el => el['pid'] === 110);

            expect(moment(result_product_100.counting_date).format('YYYY-MM-DD')).toBe(moment().format('YYYY-MM-DD'));
            expect(moment(result_product_110.counting_date).format('YYYY-MM-DD')).toBe(moment().format('YYYY-MM-DD'));

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

    it('If it is changed to min and max Branch it should be calculated accordingly', async function (done) {
        try {
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            expect(result['length']).toBe(2);

            const product_100 = products.find(el => el['pid'] === 100);
            const branch_rule_100 = branch_stock_rules.find(el => el['pid'] === 100)
            const result_product_100 = result.find(el => el['pid'] === 100);
            // min and max not override on branch but Coefficient is override (mon_multiple)
            expect(result_product_100.stockMax).toBe(product_100.default_max * branch_rule_100.mon_multiple * product_100.default_usage);
            expect(result_product_100.max_calculated).toBe(product_100.default_max * branch_rule_100.mon_multiple * product_100.default_usage);
            expect(result_product_100.min_calculated).toBe(product_100.default_min * branch_rule_100.mon_multiple * product_100.default_usage);
            expect(result_product_100.untilNextCountingDay).toBe(1);
            expect(result_product_100.date_rule).toEqual(product_100.default_date_rule);


            const product_110 = products.find(el => el['pid'] === 110);
            const result_product_110 = result.find(el => el['pid'] === 110);
            const branch_rule_110 = branch_stock_rules.find(el => el['pid'] === 110)
            // min and max override on branch
            expect(result_product_110.stockMax).toBe(branch_rule_110.max * branch_rule_110.mon_multiple * branch_rule_110.usage);
            expect(result_product_110.max_calculated).toBe(branch_rule_110.max * branch_rule_110.mon_multiple * branch_rule_110.usage);
            expect(result_product_110.min_calculated).toBe(branch_rule_110.min * branch_rule_110.mon_multiple * branch_rule_110.usage);
            expect(result_product_110.date_rule).toEqual(branch_rule_110.date_rule);
            expect(result_product_110.pid).toBe(product_110.pid);
            expect(result_product_110.untilNextCountingDay).toBe(1);

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

    it('The parameters returned are as follows', async function (done) {
        try {
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            expect(result['length']).toBe(2);

            // min and max override on branch
            result.forEach(el => {
                expect(el.stockMax).toBeDefined();
                expect(el.min_calculated).toBeDefined();
                expect(el.max_calculated).toBeDefined();
                expect(el.product_code).toBeDefined();
                expect(el.product_name).toBeDefined();
                expect(el.date_rule).toBeDefined();
                expect(el.pid).toBeDefined();
                expect(el.product_count).toBeDefined();
                expect(el.last_count).toBeDefined();
                expect(el.is_delivery_finalised).toBeDefined();
                expect(el.ref_id).toBeDefined();
                expect(el.ref_type_id).toBeDefined();
                expect(el.submission_time).toBeDefined();
                expect(el.delivery_submission_time).toBeDefined();
                expect(el.last_product_count).toBeDefined();
                expect(el.untilNextCountingDay).toBeDefined();
            });

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });


    it(`if products have min = 10, max = 20 and default_x_multiple = 1 and default_usage = 1 but don't override rules (min, max)`, async function (done) {
        try {
            const product100 = products.find(el => el['pid'] === 100);
            product100.setDefaultMax(20);
            product100.setDefaultMin(10);
            product100.set_default_x_multiple(1);
            product100.set_default_usage(1);
            // don't have override for product
            const productRule100 = branch_stock_rules.find(el => el['pid'] === 100);
            productRule100.setMax(null);
            productRule100.setMin(null);
            productRule100.set_x_multiple(null);
            productRule100.set_usage(null);
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            const result_product_100 = result.find(el => el['pid'] === 100);
            // because all default_multiple have same value, not important which that select
            expect(result_product_100.stockMax).toEqual(product100.default_max*product100.default_usage*product100.default_tue_multiple);
            expect(result_product_100.min_calculated).toEqual(product100.default_min*product100.default_usage*product100.default_tue_multiple);
            expect(result_product_100.max_calculated).toEqual(product100.default_max*product100.default_usage*product100.default_tue_multiple);
       

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

    it(`if product have min = 10, max = 20 and default_x_multiple = 1 and default_usage = 1 but have override rules (min, max)`, async function (done) {
        try {
            const product100 = products.find(el => el['pid'] === 100);
            product100.setDefaultMax(20);
            product100.setDefaultMin(10);
            product100.set_default_x_multiple(1);
            product100.set_default_usage(1);
            // don't have override for product
            const productRule100 = branch_stock_rules.find(el => el['pid'] === 100);
            productRule100.setMax(5);
            productRule100.setMin(2);
            productRule100.set_x_multiple(null);
            productRule100.set_usage(null);
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            const result_product_100 = result.find(el => el['pid'] === 100);
            // because all default_multiple have same value, not important which that select
            expect(result_product_100.stockMax).toEqual(productRule100.max*product100.default_usage*product100.default_tue_multiple);
            expect(result_product_100.max_calculated).toEqual(productRule100.max*product100.default_usage*product100.default_tue_multiple);
            expect(result_product_100.min_calculated).toEqual(productRule100.min*product100.default_usage*product100.default_tue_multiple);
       

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

    it(`if product have min = 10, max = 20 and default_x_multiple = 1 and default_usage = 1 but have override rules (min, max, usage, x_multiple)`, async function (done) {
        try {
            const product100 = products.find(el => el['pid'] === 100);
            product100.setDefaultMax(20);
            product100.setDefaultMin(10);
            product100.set_default_x_multiple(1);
            product100.set_default_usage(1);
            // don't have override for product
            const productRule100 = branch_stock_rules.find(el => el['pid'] === 100);
            productRule100.setMax(5);
            productRule100.setMin(2);
            productRule100.set_x_multiple(3);
            productRule100.set_usage(2);
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            const result_product_100 = result.find(el => el['pid'] === 100);
            // because all default_multiple have same value, not important which that select
            expect(result_product_100.stockMax).toEqual(productRule100.max*productRule100.usage*productRule100.mon_multiple);
            expect(result_product_100.max_calculated).toEqual(productRule100.max*productRule100.usage*productRule100.mon_multiple);
            expect(result_product_100.min_calculated).toEqual(productRule100.min*productRule100.usage*productRule100.mon_multiple);
       

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

    it(`if product have min = null, max = null and default_x_multiple = null and default_usage = null but have override rules (min, max, usage, x_multiple)`, async function (done) {
        try {
            const product100 = products.find(el => el['pid'] === 100);
            product100.setDefaultMax(null);
            product100.setDefaultMin(null);
            product100.set_default_x_multiple(null);
            product100.set_default_usage(null);
            // don't have override for product
            const productRule100 = branch_stock_rules.find(el => el['pid'] === 100);
            productRule100.setMax(5);
            productRule100.setMin(2);
            productRule100.set_x_multiple(3);
            productRule100.set_usage(2);
            await defineModels();
            UnitModel.test = true;
            // branch login 3 days ago
            await sql.test.last_login.add({
                lid: 1,
                login_uid: 22,
                login_date: moment().subtract(3, 'day').format('YYYY-MM-DD'),
                previous_login_date_time: moment().subtract(3, 'day').format('YYYY-MM-DD'),
            });
            const [prep, fin_prep] = units;
            await UnitModel.saveDateAfterLogin(
                fin_prep.name,
                fin_prep.username,
                fin_prep.is_branch,
                fin_prep.uid,
                fin_prep.is_kitchen,
                moment(`${moment().format('YYYY-MM-DD')} 22:00:00`).format('YYYY-MM-DD HH:mm:ss')
            );

            let result = await StockModel.select(fin_prep.uid, moment().format('YYYY-MM-DD'))
            const result_product_100 = result.find(el => el['pid'] === 100);
            // because all default_multiple have same value, not important which that select
            expect(result_product_100.stockMax).toEqual(productRule100.max*productRule100.usage*productRule100.mon_multiple);
            expect(result_product_100.max_calculated).toEqual(productRule100.max*productRule100.usage*productRule100.mon_multiple);
            expect(result_product_100.min_calculated).toEqual(productRule100.min*productRule100.usage*productRule100.mon_multiple);
       

            done();
        } catch (err) {
            console.error(err);
            done();
        }

    });

});

const defineModels = async () => {
    // define units
    for (let index = 0; index < units.length; index++) {
        const unit = units[index];
        await sql.test.units.add(unit);
    }
    // define products
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        await sql.test.products.add(product.get());
    }
    // define branch_stock_rules
    for (let index = 0; index < branch_stock_rules.length; index++) {
        const branch_stock_rule = branch_stock_rules[index];
        await sql.test.branch_stock_rules.add(branch_stock_rule.get());
    }
}