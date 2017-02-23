/**
 * Created by Amin on 01/02/2017.
 */
const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const SqlTable = require('./sqlTable.model');
const error = require('./errors.list');

let tableName = 'units';
let idColumn  = 'uid';
const unitsColumns = ['username', 'password', 'name', 'is_branch' ];

let lastLoginTableName = 'last_login';
let lastLoginiIdColumn  = 'lid';
const lastLoginColumns = ['login_uid','login_date_time'];

class Unit extends SqlTable{
  constructor(test=Unit.test){
    super(tableName, idColumn, test);
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
    this.is_branch = data.is_branch;
  }

  exportData() {
    let exprt = {};

    unitsColumns.forEach((el) => {
      if (el!== 'password' && this[el] !== undefined) {
        if (el === 'username')
          exprt[el] = this[el].toLowerCase();
        else
          exprt[el] = this[el];
      }
    });
    return new Promise((resolve, reject) => {
      if(this.password) {
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

  checkPassword() {
    return new Promise((resolve, reject) => {
      if(!this.secret)
        reject(error.noPass);
      env.bcrypt.compare(this.password, this.secret, (err, res) => {
        if (err)
          reject(err);
        else if (!res)
          reject(error.badPass);
        else
          resolve();
      });
    });
  }

  loginCheck(username = this.username, password = this.password) {
    return new Promise((resolve, reject) => {
      this.load(username, password)
        .then(()=>this.checkPassword().then(resolve).catch(err=>reject(error.badPass)))
        .catch(err=>reject(error.noUser));
  })
  }

  insert(data) {
    this.setValues(data);
    return this.save();
  }

  update(uid, data){
    this.uid = uid;
    this.setValues(data);
    // if(data.username)
    //   this.username = data.username;
    // if(data.password)
    //   this.password = data.password;
    return this.save();
  }

  setValues(data) {
    unitsColumns.forEach((el) => {
      if (data[el]!==undefined)
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
      .then(()=>done(null, user))
      .catch(err=>done(err, false));
  }

  static select(isBranch){
    let curSql = Unit.test ? sql.test : sql;

    if(isBranch === undefined){
      return curSql[tableName].select();
    }
    else{
      const criteria = {is_branch: isBranch};

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
    }
  }

  static delete(id){
    let curSql = Unit.test ? sql.test : sql;
    return curSql[tableName].delete(id);
  }

  static afterLogin(username, isBranch) {

    return new Promise((resolve, reject) => {
      resolve({user:username,userType:username==='admin'?'admin':(isBranch?'branch':'prep')});
    })
  }

  static saveDateAfterLogin(username, isBranch,uid) {
    let date = new Date();
    let curSql = Unit.test ? sql.test : sql;
    return new Promise((resolve, reject) => {
      return curSql[lastLoginTableName].add({
        login_uid: uid,
      })
      .then((res) => {
        return curSql[lastLoginTableName].delete({
          login_uid: uid, lid: res.lid
        })
      })
      .then(()=> {
        resolve({user: username, userType: username === 'admin' ? 'admin' : (isBranch ? 'branch' : 'prep')});
      })
      .catch(err=>reject(err));
    });
  }
}

Unit.test = false;
module.exports = Unit;
