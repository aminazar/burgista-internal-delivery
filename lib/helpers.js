/**
 * Created by Amin on 05/02/2017.
 */
const moment = require('moment');
const UPPER_BOUND_HOUR = require('./../env').UPPER_BOUND_HOUR;

module.exports = {

  isTestReq: function (req) {
    return req.query.test === 'tEsT'
  },

  adminCheck: function (username) {
    return username === 'admin'
  },

  createOrExist: function (tableName, sql) {
    return new Promise((resolve, reject) => {
      sql[tableName].create()
        .then(resolve)
        .catch(err => {
          if (err.message.indexOf(`"${tableName}" already exists`) !== -1)
            resolve();
          else
            reject(err);
        })
    })
  },

  dropOrNotExit: function (tableName, sql) {
    return new Promise((resolve, reject) => {
      sql[tableName].drop()
        .then(resolve)
        .catch(err => {
          if (err.message.indexOf(`"${tableName}" does not exist`) !== -1)
            resolve();
          else
            reject(err);
        })
    })
  },

  timeCheck: function (date) {
    console.log('UPPER_BOUND_HOUR: ', UPPER_BOUND_HOUR);
    return parseInt(moment(date).format('HH')) < UPPER_BOUND_HOUR ? 1 : 0;
  }
};