const env = require('../../env');
const sql = require('../../sql');
const moment = require('moment');
const UnitModel = require('../../lib/unit.model');
const StockModel = require('../../lib/stock.model');

describe("select", () => {
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
            default_usage: 1
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
            default_usage: 9
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
        uid: 22
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
        uid: 22
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

    beforeEach(async done => {
        try {
            await sql.test.db.dropSchema();
            await sql.test.units.create();
            await sql.test.last_login.create();
            await sql.test.products.create();
            await sql.test.branch_stock_rules.create();
            await sql.test.branch_stock_delivery_date.create();

            // define units
            for (let index = 0; index < units.length; index++) {
                const unit = units[index];
                await sql.test.units.add(unit);
            }
            // define products
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                await sql.test.products.add(product);
            }
            // define branch_stock_rules
            for (let index = 0; index < branch_stock_rules.length; index++) {
                const branch_stock_rule = branch_stock_rules[index];
                await sql.test.branch_stock_rules.add(branch_stock_rule);
            }

            done();
        } catch (err) {
            console.error(err);
            fail(err.message);
            done();
        }
    });

    it('If a product has to be counted between two logins each day, it will only show the last day', async function (done) {
        try {
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

});