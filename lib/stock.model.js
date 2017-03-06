/**
 * Created by Amin on 05/03/2017.
 */
const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const error = require('./errors.list');
const SqlTable = require('./sqlTable.model');
const moment = require('moment');
const RRule = require('rrule').RRule;
const Product = require('./product.model');

let tableName = 'branch_stock_delivery_date';
let idColumn = 'bsddid';

const stockColumns = [
  'product_id',
  'branch_id',
  'counting_date',
  'submission_time',
  'min_stock',
  'product_count',
  'real_delivery',
];

class Stock extends SqlTable {
  constructor(test = Stock.test) {
    super(tableName, idColumn, test);
  }

  static select(unit_id, date) {
    let curSql = this.test ? sql.test : sql;
    return curSql[tableName].selectMax(date)
  }

  static rRuleCheckFunctionFactory(rRule, startDate, endDate) {
    let r = RRule.fromString(rRule);
    let list = r.between(moment(startDate).toDate(), moment(endDate).toDate());
    return function (date) {
      let fl = list.filter(el => moment(date).format('YYMMDD') === moment(el).format('YYMMDD'));
      return fl.length > 0;
    }
  }

  static calcMin(productData, date) {
    let key = `default_${moment(date).format('ddd').toLowerCase()}_multiple`;
    return productData.default_min * productData.default_usage * productData[key];
  }

  static branchStockDeliveryDateFunc(uid, is_branch) {
    let countDate;
    let previousLoginDate;
    let dateChecker;
    let curSql = Stock.test ? sql.test : sql;

    return new Promise((resolve, reject) => {
      if (is_branch) {
        return curSql.last_login.get_previous_login_date({login_uid: uid})
          .then((res) => {
            countDate = res[0].login_date_time;
            previousLoginDate = res[0].previous_login_date_time;
            return Product.select('admin', uid);
          })
          .then((res) => {
            let stockStack = [];
            while (countDate > previousLoginDate) {
              for (let productIndex = 0; productIndex < res.length; productIndex++) {
                dateChecker = Stock.rRuleCheckFunctionFactory(res[productIndex].default_date_rule, previousLoginDate, moment(countDate).add(1, 'day'));
                if (dateChecker(countDate)) {
                  stockStack.push({
                    product_id: res[productIndex].pid,
                    branch_id: uid,
                    counting_date: countDate,
                    min_stock: Stock.calcMin(res[productIndex], countDate),
                  });
                  res.splice(productIndex, 1);
                }
              }
              countDate = moment(countDate).subtract(1, 'day').toDate();
            }
            let db = Product.test ? env.testDb : env.db;
            return db.tx(t=>stockStack.map(el=>t.query(env.pgp.helpers.insert(el,null,'branch_stock_delivery_date'))))
          })
          .then(()=>resolve())
          .catch(err => {
            reject(err);
            console.log(err);
          })
      }
      else
        resolve();
    });
  }
}
Stock.test = false;
module.exports = Stock;