/**
 * Created by Amin on 05/03/2017.
 */
const sql = require('../sql');
const env = require('../env');
const SqlTable = require('./sqlTable.model');
const moment = require('moment-timezone');
const RRule = require('rrule').RRule;
const Product = require('./product.model');
const {delivery_ref_types} = require('../utils/consts');

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
  'ref_id',
  'ref_type_id'
];

class Stock extends SqlTable {
  constructor(test = Stock.test, testDate = Stock.date) {
    super(tableName, idColumn, test, testDate);
  }

  exportData() {
    let exprt = {};
    exprt['ref_id'] = this['ref_id'];
    exprt['ref_type_id'] = this['ref_type_id'];

    if (this.real_delivery === undefined) {
      let d = moment(Stock.date);
      exprt.submission_time = moment().tz('Europe/London').format('YYYY-MM-DD hh:mm:ssZ');
      exprt.product_count = this.product_count;
    }
    else {
      exprt.real_delivery = this.real_delivery;
      exprt.is_delivery_finalised = this.is_delivery_finalised;
      if (this.is_delivery_finalised) {
        exprt.delivery_submission_time = moment().tz('Europe/London').format('YYYY-MM-DD hh:mm:ssZ');
      }
    }

    if (this[idColumn]) {
      return exprt;
    }
    else {
      exprt.branch_id = this.branch_id;
      exprt.counting_date = moment().tz('Europe/London').format('YYYY-MM-DD');
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
    if (data['uid'])
      this.branch_id = data['uid'];

    return this.save();
  }

  static exportDataToSave(data) {
    let exprt = {};
    exprt['ref_id'] = data['ref_id'];
    exprt['ref_type_id'] = data['ref_type_id'];

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

  static checkingSubmissionTime(submit_time) {
    const timeLimit = `${moment().format('YYYY-MM-DD')} 22:00:00`;
    if (moment(`${submit_time}`, 'YYYY-MM-DD HH:ss:mm').tz('Europe/London').isBefore(moment(`${timeLimit}`, 'YYYY-MM-DD HH:ss:mm').tz('Europe/London'))) {
      throw new Error('You are not allowed to register your stock before 10:00 pm');
    }
  }

  static batchCU(data, uid) {
    Stock.checkingSubmissionTime(data.submit_time);
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
    const uid = typeof unit_id === 'undefined' ? user_id : unit_id;
    // queries
    const LastDateToCountTheProductsInTheBranch = await curSql[tableName].getMaxCountingDate({ date, uid });

    // Breakdown of products to be counted by 5 categories:
    // 1) counting today => (counting_date = today)
    const productsCountingToday = await curSql[tableName].countingToday({ date, uid });
    // 2) counted but not delivered (counting_date + 3 > date and counting_date < date )
    const productsCountedButNotDelivered = await curSql[tableName].countedButNotDelivered({ date, uid });
    // 3) not counted but delivered and finalized (counting_date + 3 > date and counting_date < date )
    const procutsNotCountedButDeliveredAndFinalized = await curSql[tableName].notCountedButDeliveredAndFinalized({ date, uid });
    // 4) not counted but not delivered (counting_date + 3 > date and counting_date < date )
    const productsNotCountedAndNotDelivered = await curSql[tableName].notCountedAndNotDelivered({ date, uid });
    // 5) delivered less than expected  (counting_date + 3 > date and counting_date < date )
    const productsDeliveredLessThanMinStock = await curSql[tableName].deliveredLessThanMinStock({ date, uid });


    const delivery_types = {
      countingToday: [],
      countedButNotDelivered: [],
      notCountedButDeliveredAndFinalized: [],
      notCountedAndNotDelivered: [],
      deliveredLessThanMinStock: [],
      branchInfo: {
        uid: uid
      }
    }

    // filter products
    delivery_types['countingToday'] = productsCountingToday;
    delivery_types['countedButNotDelivered'] = Stock.removeProductsMustBeCountedToday(productsCountingToday, productsCountedButNotDelivered, delivery_ref_types.COUNTED_BUT_NOT_DELIVERED);
    delivery_types['notCountedButDeliveredAndFinalized'] = Stock.removeProductsMustBeCountedToday(productsCountingToday, procutsNotCountedButDeliveredAndFinalized, delivery_ref_types.NOT_COUNTED_BUT_DELIVERED_AND_FINALIZED);
    delivery_types['notCountedAndNotDelivered'] = Stock.removeProductsMustBeCountedToday(productsCountingToday, productsNotCountedAndNotDelivered, delivery_ref_types.NOT_COUNTED_AND_NOT_DELIVERED);
    delivery_types['deliveredLessThanMinStock'] = Stock.removeProductsMustBeCountedToday(productsCountingToday, productsDeliveredLessThanMinStock, delivery_ref_types.DELIVERED_LESS_THAN_MIN_STOCK);


    // set delivery type
    delivery_types['countedButNotDelivered'] = Stock.setDeliveryType(delivery_types.countedButNotDelivered, delivery_ref_types.COUNTED_BUT_NOT_DELIVERED, date);
    delivery_types['notCountedButDeliveredAndFinalized'] = Stock.setDeliveryType(delivery_types.notCountedButDeliveredAndFinalized, delivery_ref_types.NOT_COUNTED_BUT_DELIVERED_AND_FINALIZED, date);
    delivery_types['notCountedAndNotDelivered'] = Stock.setDeliveryType(delivery_types.notCountedAndNotDelivered, delivery_ref_types.NOT_COUNTED_AND_NOT_DELIVERED, date);
    delivery_types['deliveredLessThanMinStock'] = Stock.setDeliveryType(delivery_types.deliveredLessThanMinStock, delivery_ref_types.DELIVERED_LESS_THAN_MIN_STOCK, date);


    // clear today counting
    delivery_types['countingToday'] = delivery_types['countingToday'].filter(el => !el['ref_id'] && !el['ref_type_id']);

    let inventoriesMerged = [].concat(delivery_types['countingToday'],
      delivery_types['countedButNotDelivered'],
      delivery_types['notCountedButDeliveredAndFinalized'],
      delivery_types['notCountedAndNotDelivered'],
      delivery_types['deliveredLessThanMinStock']
    );

    Stock.setLastCountingDate(inventoriesMerged, LastDateToCountTheProductsInTheBranch);
    Stock.setUntilNextCountingDay(inventoriesMerged);
    inventoriesMerged = Stock.inventoryItemsMapped(inventoriesMerged);
    return inventoriesMerged;
  }

  static inventoryItemsMapped(stocks) {
    const temp_stocks = [];
    stocks.forEach(stock => {
      temp_stocks.push({
        bsddid: stock['bsddid'],
        counting_date: stock['counting_date'],
        date_rule: stock['product_date_rule'],
        delivery_submission_time: stock['delivery_submission_time'],
        is_delivery_finalised: stock['is_delivery_finalised'],
        last_count: stock['last_count'],
        product_count: stock['product_count'],
        pid: stock['pid'],
        product_code: stock['product_code'],
        product_name: stock['product_name'],
        stockMax: Stock.calcMax(stock, stock.counting_date),
        submission_time: stock['submission_time'],
        ref_id: stock['ref_id'] || null,
        ref_type_id: stock['ref_type_id'] || null,
        last_product_count: stock['last_product_count'] || null,
        real_delivery: stock['real_delivery'],
        min_calculated: Stock.calcMin(stock, stock.counting_date),
        max_calculated: Stock.calcMax(stock, stock.counting_date),
        untilNextCountingDay: stock['untilNextCountingDay']
      });
    });
    return temp_stocks;
  }

  static removeProductsMustBeCountedToday(todayStocks, stocks, type_id) {
    const temp_data = [];
    let stocks_unique = [];
    stocks.forEach(stock => {
      const foundStock = stocks_unique.find(s => s['pid'] === stock['pid']);
      if (!foundStock) {
        stocks_unique.push(stock);
      }
    });
    stocks_unique.forEach(stock => {
      const productFound = todayStocks.find(p => p['product_id'] === stock['product_id']);
      if (!productFound) {
        temp_data.push(stock);
      }
    });
    todayStocks.forEach(stock => {
      if (stock['ref_type_id'] && stock['ref_id'] && stock['ref_type_id'] === type_id) {
        temp_data.push(stock);
      }
    });
    return temp_data;
  }

  static setUntilNextCountingDay(stocks) {
    if (!stocks['length']) return;
    stocks.forEach(stock => {
      stock['untilNextCountingDay'] = null;
      if (stock['product_date_rule']) {
        stock['untilNextCountingDay'] = moment(RRule.fromString(stock['product_date_rule']).after(moment().add(1, 'days').tz('Europe/London').toDate())).diff(moment().tz('Europe/London'), 'days');
      }
    });
  }

  static setLastCountingDate(stocks, products) {
    if (!stocks['length']) return;
    stocks.forEach(stock => {
      const foundProduct = products.find(pro => pro['product_id'] === stock['product_id']);
      stock['last_count'] = null;
      stock['last_product_count'] = null;
      if (foundProduct) {
        stock['last_count'] = foundProduct['counting_date'];
        stock['last_product_count'] = foundProduct['last_product_count'];
      }
      const stockDate = stock.submission_time ? moment(stock.submission_time).tz('Europe/London').toDate() : (stock.counting_date ? moment(stock.counting_date).toDate() : null);
      stock['default_min'] = stock['min'] ? stock['min'] : stock['default_min'],
      stock['default_max'] = stock['max'] ? stock['max'] : stock['default_max'],
      stock['stockDate'] = stockDate,
      stock['isPrinted'] = stock['is_delivery_finalised'],
      stock['productId'] = stock['product_id'],
      stock['oldCount'] = stock['last_product_count'],
      stock['product_name'] = stock['name'];
      stock['product_code'] = stock['code'];
    })
  }

  static setDeliveryType(stocks, type_id, date) {
    const temp_stocks = [];
    if (stocks['length']) {
      stocks.forEach(stock => {
        if (!stock['ref_type_id']) {
          stock['ref_type_id'] = type_id;
          stock['ref_id'] = stock['bsddid'];
          stock['bsddid'] = null;
          stock['counting_date'] = moment(date).toDate(),
          stock['delivery_submission_time'] = null
          stock['is_delivery_finalised'] = null
        }
        temp_stocks.push(stock);
      });
    }
    return temp_stocks;
  }

  static async deliverySelect(prep_id, unit_id, date, is_kitchen) {
    let currentSql = Stock.test ? sql.test : sql;
    let deliveries = [];
    try {
      // check when one time login, don't insert stock again
      const [adminBranchInfo] = await currentSql['last_login'].get_previous_login_date({login_uid: prep_id});
      if (moment(adminBranchInfo['login_date_time']).format('YYYY-MM-DD') !== moment(adminBranchInfo['previous_login_date_time']).format('YYYY-MM-DD')) {
        await Stock.branchStockDeliveryDateFunc(unit_id, true, moment(date).toDate(), is_kitchen);
      }
      deliveries = await Stock.select(null, moment(date).format('YYYY-MM-DD'), unit_id);
    } catch (err) {
      console.error(err);
    }
    deliveries = Stock.deliveryItemsMapped(deliveries, unit_id);
    return deliveries;
  }

  static deliveryItemsMapped(deliveries, unit_id) {
    const temp_deliveries = [];
    deliveries.forEach(delivery => {
      const stockDate = delivery.submission_time ? moment(delivery.submission_time).tz('Europe/London').toDate() : (delivery.counting_date ? moment(delivery.counting_date).toDate() : null);
      temp_deliveries.push({
        id: delivery.bsddid,
        uid: unit_id,
        stock: delivery.product_count,
        stockDate,
        untilNextCountingDay: delivery.untilNextCountingDay,
        productName: delivery.product_name,
        productCode: delivery.product_code,
        realDelivery: delivery.real_delivery,
        min: Stock.calcMin(delivery, delivery.counting_date),
        max: Stock.calcMax(delivery, delivery.counting_date),
        isPrinted: delivery.is_delivery_finalised,
        productId: delivery.pid,
        oldCount: delivery.last_product_count,
        min: delivery.min_calculated,
        max: delivery.max_calculated,
        ref_id: delivery.ref_id,
        ref_type_id: delivery.ref_type_id,
      });
    });
    return temp_deliveries;
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

  static checkIfToday(rruleStr, date){
    var RRule = require('rrule').RRule;
    var moment = require('moment');
  
    var rule = RRule.fromString(rruleStr);
  
    // Convert all dates into UTC before comparison
    var todayutc          = moment(moment(date).format('YYYY-MM-DD')).utc().startOf('day').toDate(); // today in UTC
    var nextOccurrence    = rule.after(todayutc, true); // next rule date including today
    var nextOccurutc      = moment(nextOccurrence).utc(); // convert today into utc
    var match             = moment(nextOccurutc).isSame(todayutc, 'day'); // check if 'DAY' is same
  
    return match;
  }

  static branchStockDeliveryDateFunc(uid, is_branch, date) {
    let countDate;
    let previousLoginDate;
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
                stockStack = stockStack.concat(res.filter(r => r.default_date_rule && Stock.checkIfToday(r.default_date_rule, countDate))
                  .map(el => {
                    const foundProductInDate = stockStack.find(p => el.pid === p.product_id && moment(p.counting_date).format('YYYY-MM-DD') === moment(countDate).format('YYYY-MM-DD'));
                    if (!foundProductInDate) {
                      return {
                        product_id: el.pid,
                        branch_id: uid,
                        counting_date: moment(countDate).format('YYYY-MM-DD'),
                        min_stock: Stock.calcMin(el, countDate),
                      }
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

  static getDate(date, start_time, end_time) {
    const format = 'YYYY-MM-DD HH-mm-ss';
    const clientTime = moment(date, format).format(format);
    const beforeTime = moment(`${Stock.date} ${start_time['hour']}:${start_time['min']}:${start_time['second']}`, format).format(format);
    const afterTime = moment(`${Stock.date} ${end_time['hour']}:${end_time['min']}:${end_time['second']}`, format).format(format);
    let returnDate;
    if (moment(clientTime, format).isBetween(moment(beforeTime, format), moment(afterTime, format), null, '[]')) {
      returnDate = moment(clientTime, format).subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      returnDate = moment(clientTime, format).format('YYYY-MM-DD');
    }
    return {
      _date: returnDate
    }
  }

}

Stock.test = false;
Stock.date = moment().tz('Europe/London').format('YYYY-MM-DD');
Stock.dateTime = moment().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss');
module.exports = Stock;