/**
 * Created by Ali on 2/6/2017.
 */

const sql = require('../sql');
const env = require('../env');
const helpers = require('./helpers');
const sqlTable = require('./sqlTable.model');
const error = require('./errors.list');
const unitType = require('./unit.type');
const User = require('./user.model');

class Unit extends User {
  constructor(test = false) {
    super(test);
  }

  static getUnits(type) {           //type is one of the unitType enum members

    const criteria = {branch_or_prep: type};

    return new Promise((resolve, reject) => {
      this.sql.units.getUnits(criteria)
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

module.exports = Unit;