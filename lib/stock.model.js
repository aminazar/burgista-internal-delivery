/**
 * Created by Amin on 05/03/2017.
 */
const sql = require('../sql');
const env = require('../env');
const SqlTable = require('./sqlTable.model');
const moment = require('moment-timezone');
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
  'insert_time',
  'delivery_submission_time',
];

class Stock extends SqlTable {
  constructor(test = Stock.test, testDate = Stock.date) {
    super(tableName, idColumn, test, testDate);
  }

  exportData() {
    let exprt = {};

    if (this.real_delivery === undefined) {
      let d = moment(Stock.date);
      exprt.submission_time = moment().format('YYYY-MM-DD hh:mm:ssZ');
      exprt.product_count = this.product_count;
    }
    else {
      exprt.real_delivery = this.real_delivery;
      exprt.is_delivery_finalised = this.is_delivery_finalised;
      if (this.is_delivery_finalised) {
        exprt.delivery_submission_time = moment().format('YYYY-MM-DD hh:mm:ssZ');
      }
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
    if (data.is_delivery_finalised) {
      data.delivery_submission_time = moment().format('YYYY-MM-DD hh:mm:ssZ');
    }
    stockColumns.concat([idColumn]).forEach(col => {
      if (data[col] !== undefined)
        this[col] = data[col];
    });
    if (uid)
      this.branch_id = uid;

    return this.save();
  }

  static exportDataToSave(data) {
    let exprt = {};

    if (data.real_delivery === undefined) {
      let d = moment(Stock.date);
      exprt.submission_time = moment().format('YYYY-MM-DD hh:mm:ssZ');
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

  static batchCU(data, uid) {
    let newItems = data.insert;
    let oldItems = data.update;

    return new Promise((resolve, reject) => {
      let db = Stock.test ? env.testDb : env.db;

      var promiseList = [];

      if (newItems.length > 0)
        promiseList = newItems.map(item => {
          return new Promise((res, rej) => {
            let obj = {};
            stockColumns.concat([idColumn]).forEach(col => {
              if (item[col] !== undefined)
                obj[col] = item[col];
            });
            if (uid)
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

            if (oldItems.length > 0) {
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

            if (newItems.length > 0) {
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

  static async select(user_id, date, unit_id) {
    let curSql = Stock.test ? sql.test : sql;
    let uid = typeof unit_id === 'undefined' ? user_id : unit_id;
    // queries
    const LastDateToCountTheProductsInTheBranch = await curSql[tableName].getMaxCountingDate({date: moment(date).format('YYYY-MM-DD'), uid});
    const productsToBeCountedInThisBranch = await curSql[tableName].getStockDeliveryBranch({date: moment(date).format('YYYY-MM-DD'), uid});

    // Breakdown of products to be counted by 4 categories:
    // 1 - The products that must be counted today
    const {productMustBeCountedToday} = Stock.productMustBeCountedTodayFunc(productsToBeCountedInThisBranch);
    // 2 - The products Have been counted but not Delivered
    const {productsHaveBeenCountedButNotDelivered} = Stock.productsHaveBeenCountedButNotDeliveredFunc(productsToBeCountedInThisBranch);
    // 3 - The products Delivered less than the minimum required
    const {productsDeliveredLessThanTheMinimumStock} = Stock.productsDeliveredLessThanTheMinimumStockFunc(productsToBeCountedInThisBranch);
    // 4 - The products Not counted
    const {productsNotCounted} = Stock.productsNotCountedFunc(productsToBeCountedInThisBranch);

    let results = [];

    results = results.concat(productMustBeCountedToday, productsHaveBeenCountedButNotDelivered, productsDeliveredLessThanTheMinimumStock, productsNotCounted);

    Stock.setLastCountingDate(results, LastDateToCountTheProductsInTheBranch);

    results.sort(Stock.sortBaseOnCountingDate);

    results = results.filter((e, i, a) => a.findIndex(el => el.pid === e.pid) === i);

    return results;

    // sorting base on counting_date
    // .sort((x, y) => y.counting_date - x.counting_date)
    // filter products are duplicate
    // .filter((e, i, a) => a.findIndex(el => el.pid === e.pid) === i)
  }

  static setLastCountingDate(stocks, products) {
    stocks.forEach(stock => {
      const foundProduct = products.find(pro => pro['product_id'] === stock['product_id']);
      if (foundProduct) {
        stock['last_count'] = foundProduct['counting_date'];
        stock['product_name'] = stock['name'];
        stock['product_code'] = stock['code'];
      }
    })
  }

  static sortBaseOnCountingDate(a, b) {
    if ( a.counting_date < b.counting_date ){
      return -1;
    }
    if ( a.counting_date > b.counting_date ){
      return 1;
    }
    return 0;
  }

  static productsNotCountedFunc(stocks) {
    const stocks_temp = [];
    stocks.forEach(stock => {
      if (!stock['product_count']) {
        stocks_temp.push(stock);
      }
    });

    return {
      productsNotCounted: stocks_temp
    }
  }

  static productsDeliveredLessThanTheMinimumStockFunc(stocks) {
    const stocks_temp = [];
    stocks.forEach(stock => {
      if (stock['real_delivery'] + stock['product_count'] < stock['min_stock'] && stock['is_delivery_finalised'] && stock['delivery_submission_time']) {
        stocks_temp.push(stock);
      }
    });

    return {
      productsDeliveredLessThanTheMinimumStock: stocks_temp
    }
  }

  static productsHaveBeenCountedButNotDeliveredFunc(stocks) {
    const stocks_temp = [];
    stocks.forEach(stock => {
      if (stock['product_count'] && !stock['delivery_submission_time'] && !stock['real_delivery'] ) {
        stocks_temp.push(stock);
      }
    });

    return {
      productsHaveBeenCountedButNotDelivered: stocks_temp
    }
  }

  static productMustBeCountedTodayFunc(stocks) {
    const stocks_temp = [];
    stocks.forEach(stock => {
      if (stock['product_date_rule'] && Stock.checkIfToday(stock['product_date_rule'])) {
        stocks_temp.push(stock);
      }
    });

    return {
      productMustBeCountedToday: stocks_temp
    }
  }

  static checkIfToday(rruleStr){
    var RRule = require('rrule').RRule;
    var moment = require('moment');
  
    var rule = RRule.fromString(rruleStr);
  
    // Convert all dates into UTC before comparison
    var todayutc          = moment().utc().startOf('day').toDate(); // today in UTC
    var nextOccurrence    = rule.after(todayutc, true); // next rule date including today
    var nextOccurutc      = moment(nextOccurrence).utc(); // convert today into utc
    var match             = moment(nextOccurutc).isSame(todayutc, 'day'); // check if 'DAY' is same
  
    return match;
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
            const stockDate = row.submission_time ? moment(row.submission_time).tz('Europe/London').toDate() : (row.counting_date ? moment(row.counting_date).toDate() : null);
            const rrule = row.date_rule !== null ? row.date_rule : row.default_date_rule;
            let untilNextCountingDay;
            try {
              untilNextCountingDay = rrule ? moment(RRule.fromString(rrule).after(moment().add(1, 'days').tz('Europe/London').toDate())).diff(moment().tz('Europe/London'), 'days') : null;
            } catch (e) {
              untilNextCountingDay = rrule;
            }
            return {
              id: row.bsddid,
              uid: unit_id,
              stock: row.product_count,
              stockDate,
              untilNextCountingDay,
              productName: row.name,
              productCode: row.code,
              realDelivery: row.real_delivery,
              min: Stock.calcMin(row, row.counting_date),
              max: Stock.calcMax(row, row.counting_date),
              isPrinted: row.is_delivery_finalised,
              productId: row.product_id,
              oldCount: row.last_product_count,
            }
          }));
        })
        .catch(reject);
    });
  }

  static deliveryReport(startDate, endDate, branchId) {
    let currentSql = Stock.test ? sql.test : sql;

    function wrapDeliveries(deliveries) {
      return deliveries.map(delivery => {
        if (delivery.product_price) {
          delivery.product_price = delivery.product_price.substring(1);
          delivery.product_price = delivery.product_price.replace(/,/g, "");
        }
        if (delivery.subtotal) {
          delivery.subtotal = delivery.subtotal.substring(1);
          delivery.subtotal = delivery.subtotal.replace(/,/g, "");
        }
        return delivery;
      })
    }

    return new Promise((resolve, reject) => {
      if (typeof branchId !== 'undefined') { // branch is chosen
        currentSql.branch_stock_delivery_date.deliveryReportByBranch({
          start_date: startDate,
          end_date: endDate,
          branch_id: branchId
        }).then(results => {
          resolve(wrapDeliveries(results))
        })
          .catch(err => {
            reject(err);
          })
      } else { // all branches
        currentSql.branch_stock_delivery_date.deliveryReport({
          start_date: startDate,
          end_date: endDate
        }).then(results => {
          resolve(wrapDeliveries(results))
        }).catch(err => {
          reject(err);
        })
      }
    });
  }

  static inventoryReport(branchId) {
    let currentSql = Stock.test ? sql.test : sql;
    return new Promise((resolve, reject) => {
      currentSql.branch_stock_delivery_date.inventoryCountingReport()
        .then(result => {
          let filtered = result.filter(row =>
            row.branch_id == branchId
            && (row.overridden_rrule !== null ? row.overridden_rrule : row.rrule) !== '' //Filtering out rrules with 'never' value
          );
          let couples = {}; // this object is just for preventing a couple to be added twice
          let finalRows = [];
          let product_ids = [...new Set(filtered.map(r => r.product_id))];
          product_ids.forEach(product_id => {
            let coupleArray = filtered.filter(item => product_id === item.product_id);
            if (coupleArray.length === 2) { // if couple found

              //coupleArray.sort((a, b) => moment(a.counting_date) < moment(b.counting_date));
              // after sorting, item with index 0 is the row of the last inventory count
              if (!couples[coupleArray[0].delivery_id]) { // check if this couple has been found
                couples[coupleArray[0].delivery_id] = coupleArray[1].delivery_id;
                let ruleStr = coupleArray[0].overridden_rrule !== null ? coupleArray[0].overridden_rrule : coupleArray[0].rrule;
                let rule = RRule.fromString(ruleStr);
                let nextCountDate = rule.after(moment().tz('Europe/London').toDate());
                let consumption = coupleArray[1].product_count + coupleArray[1].real_delivery - coupleArray[0].product_count;
                let rangeLength = moment(coupleArray[0].counting_date).diff(moment(coupleArray[1].counting_date), 'days');
                let daysFromLastCounting = moment(nextCountDate).diff(moment(coupleArray[0].counting_date), 'days');
                let estimate = coupleArray[0].product_count + coupleArray[0].real_delivery -
                  (consumption * daysFromLastCounting / rangeLength);

                finalRows.push({
                  product_name: coupleArray[0].product_name,
                  product_code: coupleArray[0].product_code,
                  branch_name: coupleArray[0].branch_name,
                  last_counted: coupleArray[0].counting_date,
                  product_count: coupleArray[0].product_count,
                  next_count_date: nextCountDate,
                  estimate: estimate.toFixed(1),
                });
              }
            } else {
              let row = coupleArray[0];
              let ruleStr = row.overridden_rrule ? row.overridden_rrule : row.rrule;
              let rule = RRule.fromString(ruleStr);
              row.next_count_date = rule.after(moment().tz('Europe/London').toDate());
              row.last_counted = row.counting_date;
              row.estimate = 'Not enough data';
              finalRows.push(row);
            }
          });
          resolve(finalRows);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  static rRuleCheck(rRule, startDate, countDate ) {
    let r = RRule.fromString(rRule);
    return r.after(moment.utc(moment(startDate).add(1,'day').format('YYYY-MM-DD')).toDate()) <= moment.utc(moment.utc(moment(countDate).add(1,'day').format('YYYY-MM-DD'))).toDate();
  }

  static calcMin(productData, date, max = false) {
    const postfix = max ? 'max' : 'min';

    for (let key in productData)
      if (productData[`default_${key}`] !== undefined && productData[key] !== null)
        productData[`default_${key}`] = productData[key];

    let overrideKey = `${moment(date).format('ddd').toLowerCase()}_multiple`;
    let key = 'default_' + overrideKey;
    return Math.ceil(productData['default_' + postfix] * productData.default_usage * productData[key]);
  }

  static calcMax(productData, date) {
    return Stock.calcMin(productData, date, true)
  }

  static branchStockDeliveryDateFunc(uid, is_branch, date) {
    let countDate;
    let previousLoginDate;
    let dateChecker;
    let curSql = Stock.test ? sql.test : sql;

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
                stockStack = stockStack.concat(res.filter(r => r.default_date_rule &&
                  !stockStack.find(p => r.pid === p.product_id) &&
                  Stock.rRuleCheck(r.default_date_rule, previousLoginDate, countDate))
                  .map(el => {
                    return {
                      product_id: el.pid,
                      branch_id: uid,
                      counting_date: moment(countDate).format('YYYY-MM-DD'),
                      min_stock: Stock.calcMin(el, countDate),
                    }
                  }));
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
Stock.date = moment().tz('Europe/London').format('YYYY-MM-DD');
module.exports = Stock;