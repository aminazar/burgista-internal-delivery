/**
 * Created by Ali on 2/19/2017.
 */

const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const error = require('./errors.list');
const SqlTable = require('./sqlTable.model');

let tableName = 'products';
let idColumn = 'pid';

const productColumns = ['prep_unit_id', 'code', 'name', 'size', 'measuring_unit', 'default_max', 'default_min', 'default_date_rule', 'default_multiples'];

class Product extends SqlTable {
  constructor(test = Product.test){
    super(tableName, idColumn, test);
  }

  importData(data){
    productColumns.forEach((el) => {
      if(data[el] !== undefined)
        this[el] = data[el];
    });
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
    return this.save();
  }

  update(data, product_id, unit_id) {
    if (unit_id === undefined) {
      this.pid = product_id;
      this.importData(data);
      return this.save();
    }             //Should update products table only
    else {
      return new Promise((resolve, reject) => {
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
                multiples: (data.multiples !== undefined) ? data.multiples : null
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
                multiples: (data.multiples !== undefined) ? data.multiples : res[0].multiples
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

  static delete(product_id, unit_id){
    let curSql = Unit.test ? sql.test : sql;

    if(unit_id === undefined){
      return curSql[tableName].delete(id);
    }                                       //Should delete from products table
    else{
      return curSql['branch_stock_rules'].delete({
        pid: product_id,
        uid: unit_id
      });
    }                                       //Should delete from branch_stock_rules table
  }

  static select(unit_id){
    let curSql = Product.test ? sql.test : sql;

    return new Promise((resolve, reject) => {
      curSql[tableName].select()
        .then((res) => {
          if(unit_id !== undefined){            //Should override default values if was defined in branch_stock_rules table
            curSql['branch_stock_rules'].get({uid: unit_id})
              .then((overRes) => {
                resolve(this.overrideDefaultValues(res, overRes));
              })
              .catch((error) => {
                console.log(error.message);
                reject(error.message);
              })
          }
          else{
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
        //Check all fields in branch_stock_rules table
        if(overrideValue.max !== null)
          product.default_max = overrideValue.max;

        if(overrideValue.min !== null)
          product.default_min = overrideValue.min;

        if(overrideValue.date_rule !== null)
          product.default_date_rule = overrideValue.date_rule;

        if(overrideValue.multiples !== null)
          product.default_multiples = overrideValue.multiples;
      }
    });

    return productList;
  }
}

Product.test = false;
module.exports = Product;