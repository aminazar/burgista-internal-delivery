/** Created by Sareh on 3/29/2017.**/
const request = require("request");
const base_url = "http://localhost:3000/api/";
const test_query = '?test=tEsT';
const lib = require('../lib');
const sql = require('../sql');
const moment = require('moment');
let req = request.defaults({jar: true});//enabling cookies

describe("REST API/ Stock API", ()=> {

  describe("stock", () => {
    let test_uid1,test_uid2,test_uid3,test_uid4,test_uid5,test_pid1,test_pid2,test_pid3,test_pid4,test_data,test_bsddid,adminUid;
    let override_1 = {
      date_rule: 'DTSTART=20170303;FREQ=WEEKLY;INTERVAL=1;BYDAY=SA,MO',
      usage: 2,
    };
    let override_2 = {
      date_rule: 'DTSTART=20170303;FREQ=DAILY;INTERVAL=3',
      usage: 2,
    };
    let override_3 = {
      date_rule: 'DTSTART=20170303;FREQ=DAILY;INTERVAL=3'
    };
    let originalTimeout;
    let clearDB = done => {
      let dropOrNotExist = function (tableName) {
        return lib.helpers.dropOrNotExit(tableName, sql.test)
      }
      dropOrNotExist('last_login')
        .then(() => {
          return dropOrNotExist('branch_stock_delivery_date')
        })
        .then(()=> {
          return dropOrNotExist('branch_stock_rules')
        })
        .then(() => {
          return dropOrNotExist('products')
        })
        .then(() => {
          return dropOrNotExist('units')
        })
        .then(() =>{
          done();
        })
        .catch((err) => {
          console.log(err.message);
          fail(err.message);
          done();
        });
    };

    beforeEach((done) => {
      originalTimeout = jasmine.getEnv().defaultTimeoutInterval;
      jasmine.getEnv().defaultTimeoutInterval = 20000;
      let create = tableName => lib.helpers.createOrExist(tableName,sql.test);
      clearDB(()=> {
        create('units') //create units table
          .then((res) => {
            return create('last_login');
          })//Create last_login table
          .then((res) => {
            return create('products');
          })//Create products table
          .then((res) => {
            return create('branch_stock_rules');
          })//Create branch_stock_rules table
          .then((res) => {
            return create('branch_stock_delivery_date');
          })//Create branch_stock_delivery_date table
          .then((res) => {
            let branch = new lib.Unit(true);
            branch.name = 'Ali Salehi';
            branch.username = 'alisalehi';
            branch.password = '12345';
            branch.is_branch = true;
            return branch.save();
          })//Add an unit (branch unit)
          .then((res) => {
            test_uid1 = res;
            u = new lib.Unit(true);
            u.name = 'Sareh Salehi';
            u.username = 'sarehsalehi';
            u.password = '12345';
            u.is_branch = true;
            return u.save();
          })//Add an unit (branch unit)
          .then((res) => {
            test_uid2 = res;
            u = new lib.Unit(true);
            u.name = 'Sadra Salehi';
            u.username = 'sadrasalehi';
            u.password = '12345';
            u.is_branch = false;
            return u.save();
          })//Add an unit (prep unit)
          .then((res) => {
            test_uid3 = res;
            u = new lib.Unit(true);
            u.name = 'Negar Salehi';
            u.username = 'negarsalehi';
            u.password = '12345';
            u.is_branch = false;
            return u.save();
          }) //Add another unit (prep unit)
          .then((res) => {
            test_uid4 = res;
            let branch = new lib.Unit(true);
            branch.name = 'Amin';
            branch.username = 'amin';
            branch.password = '12345';
            branch.is_branch = true;
            return branch.save();
          })//Add an unit (branch unit)
          .then((res) => {
            test_uid5 = res;
            p = new lib.Product(true);
            p.name = 'Frying oil';
            p.code = 'fo01';
            p.prep_unit_id = test_uid3;
            p.size = 10;
            p.measuring_unit = 'Kg';
            p.default_max = 12;
            p.default_min = 11;
            p.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return p.save();
          }) //Add a product
          .then((res) => {
            test_pid1 = res;
            let product = new lib.Product(true);
            product.name = 'Meat';
            product.code = 'm01';
            product.prep_unit_id = test_uid4;
            product.size = 20;
            product.measuring_unit = 'Kg';
            product.default_max = 5;
            product.default_min = 2;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid2 = res;
            let product = new lib.Product(true);
            product.name = 'orange';
            product.code = 'o01';
            product.prep_unit_id = test_uid3;
            product.size = 20;
            product.measuring_unit = 'gr';
            product.default_max = 50;
            product.default_min = 6;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T075434Z;INTERVAL=1';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid3 = res;
            let product = new lib.Product(true);
            product.name = 'apple';
            product.code = 'a01';
            product.prep_unit_id = test_uid4;
            product.size = 10;
            product.measuring_unit = 'gr';
            product.default_max = 20;
            product.default_min = 2;
            product.default_date_rule = 'FREQ=DAILY;DTSTART=20170303T121903Z;INTERVAL=1000';
            return product.save();
          }) //Add another product
          .then((res) => {
            test_pid4 = res;
            let a = new lib.Unit(true);
            a.name = 'Admin';
            a.username = 'admin';
            a.password = '11111';
            a.is_branch = false;
            return a.save();
          })//Add admin user (into units table)
          .then((res) => {
            adminUid = res;
            let product = new lib.Product(true);
            return product.update(override_1, test_pid3, 'admin', test_uid1)
          })//override product 3 for branch 1
          .then(() => {
            let product = new lib.Product(true);
            return product.update(override_2, test_pid3, 'admin', test_uid2)
          })//override product 3 for branch 2
          .then(() => {
            let product = new lib.Product(true);
            return product.update(override_3, test_pid1, 'admin', test_uid5)
          })//override product 1 for branch 5
          .then(() => {
            setup = false;
            done();
          })
          .catch((err) => {
            console.log(err.message);
            done();
          })
      })
    });

    it('should pass a inevitable spec', () => {
      expect(true).toBe(true);
    });

    it('should show correct row number of units & last_login & branch_stock_delivery_date & branch_stock_rules table/1', done => {
      sql.test.units.select()
        .then((res) => {
          expect(res.length).toBe(5);
          return sql.test.last_login.select()
        })
        .then((res) => {
          expect(res.length).toBe(0);
          return sql.test.branch_stock_delivery_date.select()
        })
        .then((res) =>{
          expect(res.length).toBe(0);
          return sql.test.branch_stock_rules.select()
        })
        .then((res) =>{
          expect(res.length).toBe(3);
          done();
        })
        .catch((err)=> {
          console.log(err.message);
          done()
        });
    });

    it('should branch1 can login/1',(done) => {
      req.post({
        url: base_url + 'login' + test_query + '&testDate=2017-03-09',
        form: {
          username: 'alisalehi',
          password: '12345'
        }
      }, (error, response) => {
        if (error) {
          fail(error.message);
          done();
        }
        else if(response){
        expect(response.statusCode).toBe(200);
        sql.test.last_login.select()
          .then((res) => {
            expect(res.length).toBe(1);
            return sql.test.last_login.get_previous_login_date({
              login_uid: 1,
            })
          })
          .then((res) => {
            expect(res.length).toBe(1);
            expect(res[0].previous_login_date_time).toBe(null);
            expect(res[0].login_uid).toBe(1);
            expect(moment(res[0].login_date_time).format('YYYY-MM-DD')).toBe('2017-03-09');
            return sql.test.branch_stock_delivery_date.select()
          })
          .then((res) => {
            expect(res.length).not.toBeLessThan(2);
            //***********************************

            req.get(base_url + 'logout' + test_query, (err, res) => {
              if (err) {
                fail(error.message);
                done();
              }
              else if(res){
                expect(res.statusCode).toBe(200);
                req.post({
                  url: base_url + 'login' + test_query + '&testDate=2017-03-20',
                  form: {
                    username: 'alisalehi',
                    password: '12345'
                  }
                }, (error, response) => {
                  if (error) {
                    fail(error.message);
                    done();
                  }
                  else if(response){
                    expect(response.statusCode).toBe(200);
                    sql.test.last_login.select()
                      .then((res) => {
                        expect(res.length).toBe(1);
                        return sql.test.last_login.get_previous_login_date({
                          login_uid: test_uid1,
                        })
                      })
                      .then((res) => {
                        expect(res.length).toBe(1);
                        expect(res[0].login_uid).toBe(1);
                        expect(res[0].previous_login_date_time).not.toBe(null);
                        expect(moment(res[0].login_date_time).format('YYYY-MM-DD')).toBe('2017-03-20');
                        expect(moment(res[0].previous_login_date_time).format('YYYY-MM-DD')).toBe('2017-03-09');
                        return sql.test.branch_stock_delivery_date.select()
                      })
                      .then((res) => {
                        expect(res.length).not.toBe(3);
                        req.get(base_url + 'logout' + test_query, (err, res) => {
                          if (err) {
                            fail(error.message);
                            done();
                          }
                          else if (res) {
                            expect(res.statusCode).toBe(200);
                            done();
                          }
                        });
                      })
                      .catch((err) => {
                        console.log(err.message);
                        done()
                      });
                  }
                });
              }
            });

            done();
          })
          .catch((err) => {
            console.log(err.message);
            done()
          });
        }
        });
    });

    let testDate = '20170309';
    it('should behave correctly where branch did not login', done => {
      req.post({
        url: base_url + 'login' + test_query + '&testDate=' + testDate,
        form: {
          username: 'sadrasalehi',
          password: '12345'
        }
      }, (error, response) => {
        if (error) {
          fail(error.message);
          done();
        }
        else if (response) {
          expect(response.statusCode).toBe(200);
          req.get(base_url+ 'unit' + test_query +'&isBranch=true', (err,res) => {
            res = JSON.parse(res.body);
            if(err || !res){fail(err.message);done();}
            else {
              expect(res.length).toBe(3);
              expect(res[2].uid).toBe(test_uid5);
              if(res[2].uid===test_uid5){
                let deliveryUrl = `${base_url}delivery/${testDate}/${res[2].uid}${test_query}`;
                req.get(deliveryUrl, (err,res) => {
                  res = JSON.parse(res.body);
                  if(err || !res){fail(err.message);done()}
                  else {
                    expect(res.length).toBe(2);
                    expect(res.map(r=>r.productName)).toContain('orange');
                    expect(res.map(r=>r.productName)).toContain('Frying oil');
                    expect(res.filter(r=>r.stock===null).length).toBe(2);
                    expect(moment(res.filter(r=>r.productId===1)[0].stockDate).format('YYYYMMDD')).toBe('20170309');
                    let bsddid = res.filter(r=>r.productId===1)[0].id;
                    expect(bsddid).toBeTruthy();
                    if(bsddid) {
                      let realDelivery = 10;
                      req.post({
                        url: `${base_url}delivery/${bsddid}${test_query}&testDate=${testDate}`,
                        form: {
                          real_delivery: realDelivery,
                          is_delivery_finalised: true,
                        }
                      }, (err, res) => {
                        res = JSON.parse(res.body);
                        if(err || !res){fail(err.message);done()}
                        else {
                          expect(res).toBe(bsddid+'');
                          console.log(deliveryUrl);
                          req.get(deliveryUrl, (err,res) => {
                            res = JSON.parse(res.body);
                            if (err || !res) {
                              fail(err.message);
                              done();
                            }
                            else{
                              let f = res.filter(r=>r.productId===1)[0];
                              expect(moment(f.stockDate).format('YYYYMMDD')).toBe('20170309');
                              expect(f.id).toBe(bsddid);
                              expect(f.realDelivery).toBe(realDelivery);
                              expect(f.isPrinted).toBe(true);
                              req.get(`${base_url}logout${test_query}`, (err,res)=>{
                                expect(res.statusCode).toBe(200);
                                let stockDate = '20170311';
                                req.post({
                                  url: `${base_url}login${test_query}&testDate=${stockDate}`,
                                  form: {
                                    username: 'amin',
                                    password: '12345'
                                  }
                                }, (err, res) => {
                                  if (err) {
                                    fail(error.message);
                                    done();
                                  }
                                  else {
                                    expect(res.statusCode).toBe(200);
                                    req.get(`${base_url}stock/${stockDate}${test_query}&testDate=${stockDate}`, (err,res)=>{
                                      res = JSON.parse(res.body);
                                      if(err || !res){fail(err.message);done()}
                                      else {
                                        let f = res.filter(r=>r.bsddid===bsddid)[0];
                                        expect(moment(f.counting_date).format('YYYYMMDD')).toBe('20170309');
                                        expect(f.last_count).toBe(null);
                                        expect(f.product_count).toBe(null);
                                        done();
                                      }
                                    })
                                  }
                                });
                              })
                            }
                          });
                        }

                      });
                    }
                    else done();
                  }
                })
              }
              else done();
            }
          })
        }
      })
    });

    afterEach((done) => {
      clearDB(done);
      jasmine.getEnv().defaultTimeoutInterval = originalTimeout;
    });
  });

});