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
  'is_delivery_finalised',
];

class Stock extends SqlTable {
  constructor(test = Stock.test) {
    super(tableName, idColumn, test);
  }

  exportData() {
    let exprt = {};

    if(this.real_delivery === undefined) {
      exprt.submission_time = moment().format('YYYY-MM-DD hh:mm:ssZ');
      exprt.product_count = this.product_count;
    }
    else {
      exprt.real_delivery = this.real_delivery;
      exprt.is_delivery_finalised = this.is_delivery_finalised;
    }

    if (this[idColumn]) {
      return exprt;
    }
    else {
      exprt.branch_id = this.branch_id;
      exprt.counting_date = moment().utc().format('YYYY-MM-DD');
      exprt.product_id = this.product_id;
      return new Promise((resolve, reject) => {
        this.sql.branch_stock_delivery_date.getProductWithOverride({pid: this.product_id, uid: this.branch_id})
          .then(res => {
            if (res.length !== 1)
              reject(`Result of product/override query - expected length 1, got ${res.length}`);
            else {
              for (let key in res[0])
                if (res[0][`default_${key}`] !== undefined && res[0][key] !== null)
                  res[0][`default_${key}`] = res[0][key];

              exprt.min_stock = Stock.calcMin(res[0], moment().utc().format('YYYY-MM-DD'));
              resolve(exprt);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }

  saveData(data, uid, id) {
    this[idColumn] = id;
    stockColumns.concat([idColumn]).forEach(col => {
      if (data[col] !== undefined)
        this[col] = data[col];
    });
    this.branch_id = uid;
    return this.save();
  }

  static select(unit_id, date) {
    let curSql = Stock.test ? sql.test : sql;
    return curSql[tableName].selectMaxDate({date: moment(date).format('YYYY-MM-DD'), uid: unit_id})
  }

  static deliverySelect(prep_id, unit_id, date) {
    let curSql = Stock.test ? sql.test : sql;
    return new Promise((resolve,reject) => {
      curSql.branch_stock_delivery_date.getBranchDelivery({prep_uid:prep_id, date: moment(date).format('YYYY-MM-DD'),uid:unit_id})
        .then( res => {
          console.log('in deliverySelect', res);
          resolve(res.map(row => {
            return {
              id: row.bsddid,
              stock: row.product_count,
              stockDate: row.submission_time ? moment(row.submission_time).toDate() : moment(row.counting_date).toDate(),
              productName: row.name,
              productCode: row.code,
              realDelivery: row.real_delivery,
              min: Stock.calcMin(row, date),
              max: Stock.calcMax(row),
              isPrinted: row.is_delivery_finalised,
            }
          }));
        })
        .catch(reject);
    });
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
    let overrideKey = `${moment(date).format('ddd').toLowerCase()}_multiple`;
    let key = 'default_' + overrideKey;
    return productData.default_min * productData.default_usage * (productData[overrideKey] ? productData[overrideKey] : productData[key]);
  }

  static calcMax(productData) {
    return productData.max ? productData.max : productData.default_max;
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
            if (previousLoginDate === null) previousLoginDate = countDate;
            return Product.select('admin', uid);
          })
          .then((res) => {
            let stockStack = [];
            while (countDate >= previousLoginDate) {
              for (let productIndex = 0; productIndex < res.length; productIndex++) {
                dateChecker = Stock.rRuleCheckFunctionFactory(res[productIndex].default_date_rule, previousLoginDate, moment(countDate).add(1, 'day'));
                if (dateChecker(countDate)) {
                  stockStack.push({
                    product_id: res[productIndex].pid,
                    branch_id: uid,
                    counting_date: moment(countDate).format('YYYY-MM-DD'),
                    min_stock: Stock.calcMin(res[productIndex], countDate),
                  });
                  res.splice(productIndex, 1);
                  productIndex --;
                }
              }
              countDate = moment(countDate).subtract(1, 'day').toDate();
            }
            let db = Product.test ? env.testDb : env.db;
            return db.task(t =>
              stockStack
                .map(el => t.query(env.pgp.helpers.insert(el, null, 'branch_stock_delivery_date')))
                .reduce((t1,t2) => {return t1.then(()=>{return t2})})
            );
          })
          .then(() => resolve())
          .catch(err => {
            if(err.message.indexOf('duplicate key value')!==-1)
              resolve();
            else
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