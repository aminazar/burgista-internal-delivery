/**
 * Created by Amin on 31/01/2017.
 */
const env = require('./env');
const sql = require('./sql');
const Unit = require('./lib/unit.model');
const lib = require('./lib');

function createOrExist(tableName) {
  return lib.helpers.createOrExist(tableName, sql);
}

function dbTestCreate() {
  return new Promise((resolve, reject) => {
    sql.db.create({dbName: env.test_db_name}, true)
      .then(res=> {
        resolve();
        // console.log(res);
        // process.exit();
      })
      .catch(err=> {
        reject(err);
        // console.log(err.message);
        // process.exit();
      });
  });
}

function prodTablesCreate() {
  return new Promise((resolve, reject) => {
    createOrExist('units')
      .then(createOrExist('products'))
      .then(createOrExist('prices'))
      .then(createOrExist('branch_stock_rules'))
      .then(createOrExist('last_login'))
      .then(createOrExist('branch_stock_delivery_date'))
      .then(resolve())
      .catch((err) => {
        reject(err);
    });
  });
}

function adminRowCreate() {
  return new Promise((resolve, reject) => {
    var unit = new Unit();

    var data = {
      name: 'admin',
      username: 'admin',
      password: 'Admin110ida',
      is_branch: false
    };

    unit.insert(data)
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function setupMainDatabase(msg) {
  console.log(msg);
  prodTablesCreate()
    .then(() => {return adminRowCreate();})
    .then(() => {
      if(env.isDev)
        return dbTestCreate();
      else
        process.exit();
    })
    .then(() => process.exit())
    .catch((err) =>{
      console.log(err.message);
      process.exit();
    });
}

if (env.isDev) {
  sql.db.create({dbName: env.db_name})
    .then(res=> {
      setupMainDatabase(res);
      // console.log(res);
      // if (env.isDev)
      //   dbTestCreate();
    })
    .catch(err=> {
      setupMainDatabase(err.message);
      // console.log(err.message);
      // if (env.isDev)
      //   dbTestCreate();
    });
} else {
  setupMainDatabase('prod db')
}