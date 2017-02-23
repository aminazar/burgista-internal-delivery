/**
 * Created by Amin on 31/01/2017.
 */
const env = require('./env');
const sql = require('./sql');
const Unit = require('./lib/unit.model');

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

function createOrExist(tableName){
  return new Promise((resolve, reject) => {
    sql[tableName].create()
      .then(resolve)
      .catch(err => {
        if(err.message.indexOf(`"${tableName}" already exists`)!==-1)
          resolve()
        else
          reject(err);
      })
  })
}

function prodTablesCreate() {
  return new Promise((resolve, reject) => {
    createOrExist('units')
      .then(createOrExist('products'))
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
      password: 'admin',
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
}