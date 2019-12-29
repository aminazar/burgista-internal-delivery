const StockModel = require('../../../lib/stock.model');
const moment = require('moment');
describe('clearDuplicateProductsInDays', () => {

    it('it should removed stocks that exist in next date', () => {
        const products = [{
            product_id: 100,
            branch_id: 1,
            counting_date: moment('2019-10-10').format('YYYY-MM-DD'),
        },{
            product_id: 100,
            branch_id: 1,
            counting_date: moment('2019-10-09').format('YYYY-MM-DD'),
        },
        {
            product_id: 100,
            branch_id: 1,
            counting_date: moment('2019-10-08').format('YYYY-MM-DD'),
        }];
        
        const result = StockModel.clearDuplicateProductsInDays(products);
        expect(result['length']).toBe(1);
    });

    it('it should removed stocks in multiple branches that exist in next date', () => {
        const products = [{
            product_id: 100,
            branch_id: 1,
            counting_date: moment('2019-10-10').format('YYYY-MM-DD'),
        },{
            product_id: 100,
            branch_id: 1,
            counting_date: moment('2019-10-09').format('YYYY-MM-DD'),
        },
        {
            product_id: 100,
            branch_id: 2,
            counting_date: moment('2019-10-08').format('YYYY-MM-DD'),
        },
        {
            product_id: 100,
            branch_id: 2,
            counting_date: moment('2019-10-10').format('YYYY-MM-DD'),
        },{
            product_id: 100,
            branch_id: 2,
            counting_date: moment('2019-10-09').format('YYYY-MM-DD'),
        },
        {
            product_id: 100,
            branch_id: 2,
            counting_date: moment('2019-10-08').format('YYYY-MM-DD'),
        }];
        
        const result = StockModel.clearDuplicateProductsInDays(products);
        expect(result['length']).toBe(2);
    });
});