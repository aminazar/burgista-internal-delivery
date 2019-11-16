const StockModel = require('../../../lib/stock.model');
describe('Stock Model -> getDate', () => {
    it(`It should still display the previous day's stock from 00:00:00 PM to 01:00:00 PM and current time is (00:10:00)`, () => {
        StockModel.date = '2017-01-02';
        const {_date} = StockModel.getDate('2017-01-02 00:10:00');
        expect(_date).toEqual('2017-01-01');
    });
    it(`It should still display the previous day's stock from 00:00:00 PM to 01:00:00 PM and current time is (00:59:00)`, () => {
        StockModel.date = '2017-01-02';
        const {_date} = StockModel.getDate('2017-01-02 00:59:00');
        expect(_date).toEqual('2017-01-01');
    });
    it(`It should display the next day's stock time greater than 01:00:00 PM and current time is (01:00:01)`, () => {
        StockModel.date = '2017-01-02';
        const {_date} = StockModel.getDate('2017-01-02 01:00:01');
        expect(_date).toEqual('2017-01-02');
    });
});