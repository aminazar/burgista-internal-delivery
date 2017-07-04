/**
 * Created by Ali on 2/19/2017.
 */

const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const error = require('./errors.list');
const SqlTable = require('./sqlTable.model');

const moment = require('moment');
const RRule = require('rrule').RRule;
const Price = require('./price.model');

let tableName = 'products';
let idColumn = 'pid';
let lastLoginTableName = 'last_login';
let unitsTableName = 'units';
let branchStockDeliveryDate = 'branch_stock_delivery_date';


const productColumns = ['prep_unit_id', 'code', 'name', 'size', 'measuring_unit', 'default_max', 'default_min', 'default_date_rule',
  'default_usage', 'default_mon_multiple', 'default_tue_multiple', 'default_wed_multiple', 'default_thu_multiple', 'default_fri_multiple',
  'default_sat_multiple', 'default_sun_multiple'];

class Product extends SqlTable {
  constructor(test = Product.test, testDate = Product.date){
    super(tableName, idColumn, test, testDate);
  }

  importData(data){
    let applied = false;
    productColumns.forEach((el) => {
      if(data[el] !== undefined) {
        this[el] = data[el];
        applied = true;
      }
    });
    return applied;
  }

  exportData(){
    let exprt = {};

    productColumns.forEach((el) => {
      if(this[el] !== undefined)
        exprt[el] = this[el];
    });

    return exprt;
  }

  insert(data){
    this.importData(data);
      return new Promise((resolve, reject) => {
          this.save()
              .then((product_id) => {
                  if (typeof data.price !== 'undefined') {
                      let price = new Price(this.test);
                      price.insert(product_id, data.price)
                          .then((res) => {
                              resolve(product_id);
                          })
                          .catch((err) => {
                              reject(err);
                          })
                  } else {
                      resolve(product_id);
                  }
              })
              .catch((error) => {
                  console.log(error);
                  reject(error);
              });
      });
  }

  update(data, product_id, username, unit_id, user_id) {
    if(unit_id === undefined && user_id !== undefined) { // user id is defined but unit id not
      unit_id = user_id;
    }

    Price.test = this.test;
    function checkPrice (product_id, newPrice, resolve, reject) {
        if (typeof newPrice !== 'undefined') { // if price has changed
            Price.setPriceOfProduct(product_id, newPrice)
                .then((res) => {
                    resolve(product_id);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        } else {
            resolve(product_id);
        }
    }

    if (unit_id === undefined && username === 'admin') { // admin and no branch selected
        this.pid = product_id;
        if (this.importData(data)) { // some properties changed
            return new Promise((resolve, reject) => {
                this.save()
                    .then((product_id) => {
                        checkPrice(product_id, data.price, resolve, reject);
                    })
                    .catch((error) => {
                        console.log(error.message);
                        reject(error.message);
                    });
            });
        } else { // nothing changed, no need to save anything, except for price (maybe)
            return new Promise((resolve, reject) => {
                checkPrice(product_id, data.price, resolve, reject);
            });
        }
    }             //Should update products table only
    else {
      return new Promise((resolve, reject) => {
        if(unit_id === undefined && username !== 'admin') {
          reject({message: 'Only admin can do this.', status: 403});
        }
        this.sql['branch_stock_rules'].getByUnitProductId({
          uid: unit_id,
          pid: product_id
        })
          .then((res) => {
            if (res.length > 1) {
              reject('Cannot have multiple overridden for one product and unit');
            }
            else if (res.length < 1) {
              return this.sql['branch_stock_rules'].add({
                pid: product_id,
                uid: unit_id,
                max: (data.max !== undefined) ? data.max : null,
                min: (data.min !== undefined) ? data.min : null,
                start_date: (data.start_date !== undefined) ? data.start_date : null,
                end_date: (data.end_date !== undefined) ? data.end_date : null,
                date_rule: (data.date_rule !== undefined) ? data.date_rule : null,
                mon_multiple: (data.mon_multiple !== undefined) ? data.mon_multiple : null,
                tue_multiple: (data.tue_multiple !== undefined) ? data.tue_multiple : null,
                wed_multiple: (data.wed_multiple !== undefined) ? data.wed_multiple : null,
                thu_multiple: (data.thu_multiple !== undefined) ? data.thu_multiple : null,
                fri_multiple: (data.fri_multiple !== undefined) ? data.fri_multiple : null,
                sat_multiple: (data.sat_multiple !== undefined) ? data.sat_multiple : null,
                sun_multiple: (data.sun_multiple !== undefined) ? data.sun_multiple : null,
                usage: (data.usage !== undefined) ? data.usage : null
              });
            }                                   //Should add a overridden record into branch_stock_rules table
            else {
              return this.sql['branch_stock_rules'].update({
                pid: product_id,
                uid: unit_id,
                max: (data.max !== undefined) ? data.max : res[0].max,
                min: (data.min !== undefined) ? data.min : res[0].min,
                start_date: (data.start_date !== undefined) ? data.start_date : res[0].start_date,
                end_date: (data.end_date !== undefined) ? data.end_date : res[0].end_date,
                date_rule: (data.date_rule !== undefined) ? data.date_rule : res[0].date_rule,
                mon_multiple: (data.mon_multiple !== undefined) ? data.mon_multiple : res[0].mon_multiple,
                tue_multiple: (data.tue_multiple !== undefined) ? data.tue_multiple : res[0].tue_multiple,
                wed_multiple: (data.wed_multiple !== undefined) ? data.wed_multiple : res[0].wed_multiple,
                thu_multiple: (data.thu_multiple !== undefined) ? data.thu_multiple : res[0].thu_multiple,
                fri_multiple: (data.fri_multiple !== undefined) ? data.fri_multiple : res[0].fri_multiple,
                sat_multiple: (data.sat_multiple !== undefined) ? data.sat_multiple : res[0].sat_multiple,
                sun_multiple: (data.sun_multiple !== undefined) ? data.sun_multiple : res[0].sun_multiple,
                usage: (data.usage !== undefined) ? data.usage : res[0].usage
              });
            }                                   //Should update a exist overridden record in branch_stock_rules table
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(err.message);
            reject(err.message);
          });
      });                                 //Should update/insert branch_stock_rules table only
    }
  }

  static delete(product_id, username, unit_id, user_id){
    if(unit_id === undefined && user_id !== undefined)
      unit_id = user_id;

    let curSql = Product.test ? sql.test : sql;

    if(unit_id === undefined && username === 'admin'){
      return curSql[tableName].delete(product_id);
    }                                       //Should delete from products table
    else{
      if(unit_id === undefined && username !== 'admin')
        return new Promise((resolve, reject) => {
          reject({message: 'Only admin can do this.', status: 403});
        });

      return new Promise((resolve, reject) => {
        curSql['branch_stock_rules'].delete({
          pid: product_id,
          uid: unit_id
        })
          .then((res) => {
            return curSql[tableName].getById({pid: product_id});
          })
          .then((res) => {
            resolve(res[0]);
          })
          .catch((err) => {
            console.log(err.message);
            reject(err.message);
          });
      });

      // return curSql['branch_stock_rules'].delete({
      //   pid: product_id,
      //   uid: unit_id
      // });
    }                                       //Should delete from branch_stock_rules table
  }

  static select(username, unit_id, user_id){
    if(unit_id === undefined && user_id !== undefined)
      unit_id = user_id;

    let curSql = Product.test ? sql.test : sql;

    return new Promise((resolve, reject) => {
      curSql[tableName].select()
        .then((res) => {
          if(unit_id !== undefined){            //Should override default values if was defined in branch_stock_rules table
            curSql['branch_stock_rules'].get({uid: unit_id})
              .then((overRes) => {
                resolve(Product.overrideDefaultValues(res, overRes));
              })
              .catch((error) => {
                console.log(error.message);
                reject(error.message);
              })
          }
          else{
            if(unit_id === undefined && username !== 'admin')
              reject({message: 'Only admin can do this.', status: 403});

            resolve(res);
          }                             //Get all products were defined in products table
        })
        .catch((err) => {
          console.log(err.message);
          reject(err.message);
        })
    });
  }

    static getForProductsReport(branchId) {
        let currentSql = Product.test ? sql.test : sql;
        function wrapProducts(products) {
            return products.map(product => {
                let rule = RRule.fromString(product.default_date_rule);
                product.recursion = rule.toText();
                return product;
            });
        }
        return new Promise((resolve, reject) => {
            currentSql[tableName].select()
                .then((result) => {
                    if (typeof branchId !== 'undefined') { // if branchId was set
                        currentSql['branch_stock_rules'].get({uid: branchId})
                            .then((overRes) => {
                                let withOverriddenData = Product.overrideDefaultValues(result, overRes);
                                resolve(wrapProducts(withOverriddenData));
                            })
                            .catch((error) => {
                                console.log(error.message);
                                reject(error.message);
                            })
                    } else {
                        resolve(wrapProducts(result));
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    reject(err.message);
                })
        });
    }

  static selectWithPrepUnitData (username, unit_id, user_id) {
      if(unit_id === undefined && user_id !== undefined) {
          unit_id = user_id;
      }

      let curSql = Product.test ? sql.test : sql;
      return new Promise((resolve, reject) => {
          curSql[tableName].getWithPrepUnitData()
              .then((res) => {
                  if(unit_id !== undefined){            //Should override default values if was defined in branch_stock_rules table
                      curSql['branch_stock_rules'].get({uid: unit_id})
                          .then((overRes) => {
                              resolve(Product.overrideDefaultValues(res, overRes));
                          })
                          .catch((error) => {
                              console.log(error.message);
                              reject(error.message);
                          })
                  }
                  else{
                      if(unit_id === undefined && username !== 'admin')
                          reject({message: 'Only admin can do this.', status: 403});

                      resolve(res);
                  }                             //Get all products were defined in products table
              })
              .catch((err) => {
                  console.log(err.message);
                  reject(err.message);
              })
      });

  }

  static overrideDefaultValues(productList, overriddenList){
    if((productList.length < 1) || (overriddenList.length < 1))
      return productList;

    productList.forEach((product) => {
      let overrideValue = overriddenList.find((element) => {
        return element.pid === product.pid;
      });

      if(overrideValue !== null && overrideValue !== undefined){
        product.isOverridden = true;

        //Check all fields in branch_stock_rules table
        if(overrideValue.max !== null)
          product.default_max = overrideValue.max;

        if(overrideValue.min !== null)
          product.default_min = overrideValue.min;

        if(overrideValue.date_rule !== null)
          product.default_date_rule = overrideValue.date_rule;

        if(overrideValue.mon_multiple !== null)
          product.default_mon_multiple = overrideValue.mon_multiple;

        if(overrideValue.tue_multiple !== null)
          product.default_tue_multiple = overrideValue.tue_multiple;

        if(overrideValue.wed_multiple !== null)
          product.default_wed_multiple = overrideValue.wed_multiple;

        if(overrideValue.thu_multiple !== null)
          product.default_thu_multiple = overrideValue.thu_multiple;

        if(overrideValue.fri_multiple !== null)
          product.default_fri_multiple = overrideValue.fri_multiple;

        if(overrideValue.sat_multiple !== null)
          product.default_sat_multiple = overrideValue.sat_multiple;

        if(overrideValue.sun_multiple !== null)
          product.default_sun_multiple = overrideValue.sun_multiple;

        if(overrideValue.usage !== null)
          product.default_usage = overrideValue.usage;
      }
    });

    return productList;
  }
}

Product.test = false;
Product.date = moment().format('YYYY-MM-DD');
module.exports = Product;