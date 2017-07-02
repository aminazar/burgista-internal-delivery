/**
 * Created by mbr on 22/06/2017.
 */
const sql = require('../sql');
const helpers = require('./helpers');
const SqlTable = require('./sqlTable.model');
const moment = require('moment');

let tableName = 'prices';
let idColumn = 'price_id';
const pricesColumns = ['price_id','product_id','price','valid_from','valid_to'];

class Price extends SqlTable {
    constructor(test = Price.test, testDate = Price.date){
        super(tableName, idColumn, test, testDate);
    }

    importData(data) {
        this.product_id = data.product_id;
        this.price = data.price;
        this.valid_from = moment().format('YYYY-MM-DD');
        this.valid_to = null;
    }

    exportData(){
        let output = {};

        pricesColumns.forEach((el) => {
            if(this[el] !== undefined)
                output[el] = this[el];
        });

        return output;
    }

    static findPriceOfProduct (product_id) {
        let curSql = Price.test ? sql.test : sql;
        return new Promise((resolve, reject) =>{
            return curSql[tableName].findByProductId({product_id: product_id})
                .then((res)=>{
                    if (!res.length) { // no old price found
                        resolve(0);
                    }
                    let str = res[0].price;
                    resolve(str.substring(1));
                })
                .catch((error)=> {
                    console.log(error);
                    reject(error.message);
                })
        });
    }

    static setPriceOfProduct (product_id, price) { // set or update the price
        let curSql = Price.test ? sql.test : sql;
        return new Promise((resolve, reject) => {
            Price.findPriceOfProduct(product_id)
                .then((oldPrice) =>{
                    if (oldPrice != price) { // price has changed
                        let data = {
                            changeDate: moment().format('YYYY-MM-DD'),
                            product_id: product_id,
                            newPrice: price,
                        };
                        return curSql[tableName].updatePriceOfProduct(data)
                            .then((price_id) => {
                                resolve(price_id);
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error.message);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error.message);
                });
        });
    }

    insert(product_id, price) {
        this.product_id = product_id;
        this.price = price;
        this.valid_from = moment().format('YYYY-MM-DD');
        this.valid_to = null;
        return this.save();
    }
}

Price.test = false;
module.exports = Price;