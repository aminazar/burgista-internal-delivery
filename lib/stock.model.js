/**
 * Created by Amin on 05/03/2017.
 */
const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
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
  constructor(test = Stock.test, testDate = Stock.date) {
    super(tableName, idColumn, test, testDate);
  }

  exportData() {
    let exprt = {};

    if (this.real_delivery === undefined) {
      let d = moment(Stock.date);
      exprt.submission_time = moment().day(d.day()).month(d.month()).year(d.year()).format('YYYY-MM-DD hh:mm:ssZ');
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
      exprt.counting_date = Stock.date;
      exprt.product_id = this.product_id;
      return new Promise((resolve, reject) => {
        this.sql.branch_stock_delivery_date.getProductWithOverride({pid: this.product_id, uid: this.branch_id})
          .then(res => {
            if (res.length !== 1)
              reject(`Result of product/override query - expected length 1, got ${res.length}`);
            else {
              exprt.min_stock = Stock.calcMin(res[0], Stock.date);
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
    if (uid)
      this.branch_id = uid;

    return this.save();
  }

  static exportDataToSave(data){
    let exprt = {};

    if (data.real_delivery === undefined) {
      let d = moment(Stock.date);
      exprt.submission_time = moment().day(d.day()).month(d.month()).year(d.year()).format('YYYY-MM-DD hh:mm:ssZ');
      exprt.product_count = data.product_count;
    }
    else {
      exprt.real_delivery = data.real_delivery;
      exprt.is_delivery_finalised = data.is_delivery_finalised;
    }

    if (data[idColumn]) {
      return exprt;
    }
    else {
      exprt.branch_id = data.branch_id;
      exprt.counting_date = Stock.date;
      exprt.product_id = data.product_id;
      return new Promise((resolve, reject) => {
        let curSql = Stock.test ? sql.test : sql;
        curSql.branch_stock_delivery_date.getProductWithOverride({pid: data.product_id, uid: data.branch_id})
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

  static batchCU(data, uid){
    let newItems = data.insert;
    let oldItems = data.update;

    return new Promise((resolve, reject) => {
      let db = Stock.test ? env.testDb : env.db;

      var promiseList = [];

      if(newItems.length > 0)
        promiseList = newItems.map(item => {
        return new Promise((res, rej) => {
          let obj = {};
          stockColumns.concat([idColumn]).forEach(col => {
            if(item[col] !== undefined)
              obj[col] = item[col];
          });
          if(uid)
            obj.branch_id = uid;

          Stock.exportDataToSave(obj)
            .then((resObj) => res(resObj))
            .catch((errObj) => rej(errObj));
        })
      });
      else
        promiseList.push(new Promise((r, j) => r()));

      Promise.all(promiseList)
        .then((result) => {
          db.tx(t => {
            var queries = [];

            if(oldItems.length > 0){
              queries.concat(oldItems.map(item => {
                let obj = {};

                stockColumns.concat([idColumn]).forEach(col => {
                  if (item[col] !== undefined)
                    obj[col] = item[col];
                });
                if (uid)
                  obj.branch_id = uid;

                return t.query(env.pgp.helpers.update(Stock.exportDataToSave(obj), null, tableName) + ` where bsddid=` + obj.bsddid);
              }));
            }

            if(newItems.length > 0){
              queries.concat(result.map(el => {
                return t.query(env.pgp.helpers.insert(el, null, tableName));
              }));
            }

            return t.batch(queries);
          })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  static select(unit_id, date) {
    let curSql = Stock.test ? sql.test : sql;
    return curSql[tableName].selectMaxDate({date: moment(date).format('YYYY-MM-DD'), uid: unit_id})
  }

  static deliverySelect(prep_id, unit_id, date, is_kitchen) {
    let curSql = Stock.test ? sql.test : sql;
    return new Promise((resolve, reject) => {
      Stock.branchStockDeliveryDateFunc(unit_id, true, moment(date).toDate(), is_kitchen)
        .then(() => {
          return curSql.branch_stock_delivery_date.getBranchDelivery({
            prep_uid: prep_id,
            date: moment(date).format('YYYY-MM-DD'),
            uid: unit_id
          })
        })
        .then(res => {
          resolve(res.map(row => {
            return {
              id: row.bsddid,
              stock: row.product_count,
              stockDate: row.submission_time ? moment(row.submission_time).toDate() : (row.counting_date ? moment(row.counting_date).toDate() : null),
              productName: row.name,
              productCode: row.code,
              realDelivery: row.real_delivery,
              min: Stock.calcMin(row, row.counting_date),
              max: Stock.calcMax(row),
              isPrinted: row.is_delivery_finalised,
              productId: row.product_id,
            }
          }));
        })
        .catch(reject);
    });
  }

  static rRuleCheckFunctionFactory(rRule, startDate, endDate) {
    let r = RRule.fromString(rRule);
    let list = r.options.freq ? r.between(moment(startDate).toDate(), moment(endDate).toDate()) : [];
    return function (date) {
      let fl = list.filter(el => moment(date).format('YYMMDD') === moment(el).format('YYMMDD'));
      return fl.length > 0;
    }
  }

  static calcMin(productData, date) {
    for (let key in productData)
      if (productData[`default_${key}`] !== undefined && productData[key] !== null)
        productData[`default_${key}`] = productData[key];

    let overrideKey = `${moment(date).format('ddd').toLowerCase()}_multiple`;
    let key = 'default_' + overrideKey;
    return Math.ceil(productData.default_min * productData.default_usage *  productData[key]);
  }

  static calcMax(productData) {
    return productData.max ? productData.max : productData.default_max;
  }

  static branchStockDeliveryDateFunc(uid, is_branch, date, is_kitchen) {
      /**
       * If is_kitchen flag is not provided we will consider all the products whether they are prepared by a kitchen or
       * not to be delivered to this branch, which is mostly a backward-compatibility feature. so keep in mind to pass
       * is_kitchen flag to this method
        */

    let countDate;
    let previousLoginDate;
    let dateChecker;
    let curSql = Stock.test ? sql.test : sql;

      /**
       * It checks if the product is provided by a Main Depot. or by a Prep. Kitchen
       * Each branch should receive goods from one of the above according to its type, Front or Kitchen
       * Front is related to Main Depot. and Kitchen to Prep. Kitchen
       * So if the branch chosen should receive the product true will be returned and otherwise false.
       */
    function matchProductWithBranch (branch_is_kitchen, product_prep_is_kitchen) {
      if (typeof branch_is_kitchen === 'undefined') { //backward compatibility
        return true;
      }
      return branch_is_kitchen === product_prep_is_kitchen;
    }

    return new Promise((resolve, reject) => {
      if (is_branch) {
        return curSql.last_login.get_previous_login_date({login_uid: uid})
          .then((res) => {
            if (res.length) {
              countDate = date ? date : res[0].login_date_time;
              previousLoginDate = res[0].previous_login_date_time;
              if (previousLoginDate === null) previousLoginDate = moment(countDate).subtract(1, 'day').toDate(); // if no previous login set yesterday as last login
            }
            else {
              countDate = date ? date : moment(Stock.date).toDate();
              previousLoginDate = moment(countDate).subtract(1, 'day').toDate();
            }

            return Product.selectWithPrepUnitData('admin', uid); // fetches all products
          })
          .then((res) => { // res is array of products
              let stockStack = [];
              while (countDate > previousLoginDate) { // goes back from today to the previous login date
                for (let productIndex = 0; productIndex < res.length; productIndex++) {
                  dateChecker = Stock.rRuleCheckFunctionFactory(res[productIndex].default_date_rule, previousLoginDate, moment(countDate).add(1, 'day'));
                  if (dateChecker(countDate) && matchProductWithBranch(is_kitchen, res[productIndex].prep_is_kitchen)) {
                    stockStack.push({
                      product_id: res[productIndex].pid,
                      branch_id: uid,
                      counting_date: moment(countDate).format('YYYY-MM-DD'),
                      min_stock: Stock.calcMin(res[productIndex], countDate),
                    });
                    res.splice(productIndex, 1);
                    productIndex--;
                  }
                }
                countDate = moment(countDate).subtract(1, 'day').toDate();
              }
              let db = Product.test ? env.testDb : env.db;
              let callback = pIndex => {
                return (s) => {
                  stockStack[pIndex].resolved = true;

                  if (stockStack.filter(r => r.resolved).length === stockStack.length)
                    resolve();
                  s();
                }
              };
              let errCallback = pIndex => {
                return (err, s) => {
                  if (err.message.indexOf('duplicate key value') !== -1)
                    callback(pIndex)(s);
                  else {
                    reject(err);
                  }
                }
              };
              if (stockStack.length) {
                return db.task(t =>
                  stockStack
                    .map((el, ind) => {
                      return new Promise((s) => {
                        t.query(env.pgp.helpers.insert(el, null, 'branch_stock_delivery_date')).then(() => callback(ind)(s)).catch(err => errCallback(ind)(err, s))
                      })
                    })
                    .reduce((t1, t2) => {
                      return t1.then(() => {
                        return t2
                      })
                    })
                );
              }
              else return new Promise((res, rej) => res());
            }
          )
          .then(() => resolve())
          .catch(err => {
            reject(err);
          })
      }
      else
        resolve();
    });
  }
}

Stock.test = false;
Stock.date = moment().format('YYYY-MM-DD');
module.exports = Stock;