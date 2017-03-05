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

class Stock extends SqlTable{
  constructor(test = Stock.test) {
    super(tableName, idColumn, test);
  }

  static select(unit_id) {
    let curSql = this.test ? sql.test : sql;
    return
    curSql.last_login.get
    curSql[tableName].select()
  }
}
Stock.test = false;
module.export = Stock;