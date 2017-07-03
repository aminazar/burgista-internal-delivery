const lib = require('../lib');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

/* GET api listing. */
function apiResponse(className, functionName, adminOnly = false, reqFuncs = []) {
  let args = Array.prototype.slice.call(arguments, 4);
  let deepFind = function (obj, pathStr) {
    let path = pathStr.split('.');
    let len = path.length;
    for (let i = 0; i < len; i++) {
      if (typeof obj === 'undefined') {
        let err = new Error(`Bad request: request.${pathStr} is not found at '${path[i]}'`);
        err.status = 400;
        throw(err);
      }
      obj = obj[path[i]];
    }
    return obj;
  };
  return (function (req, res) {
    let user = req.user ? req.user.username : req.user;
    req.test = lib.helpers.isTestReq(req);
    //Get testDate

    req.date = (req.query.testDate ? moment(req.query.testDate) : moment()).format('YYYY-MM-DD');
    if (adminOnly && !lib.helpers.adminCheck(user)) {
      res.status(403)
        .send('Only admin can do this.');
    }
    else {
      let dynamicArgs = [];
      for (let i in reqFuncs)
        dynamicArgs.push((typeof reqFuncs[i] === 'function') ? reqFuncs[i](req) : deepFind(req, reqFuncs[i]));

      let allArgs = dynamicArgs.concat(args);
      lib[className].test = req.test;
      lib[className].date = req.date;
      let isStaticFunction = typeof lib[className][functionName] === 'function';
      let model = isStaticFunction ? lib[className] : new lib[className](req.test, req.date);
      model[functionName].apply(isStaticFunction ? null : model, allArgs)
        .then(data => {
          res.status(200)
            .json(data);
        })
        .catch(err => {
          console.log(`${className}/${functionName}: `, err.message);
          res.status(err.status || 500)
            .send(err.message || err);
        });
    }
  });
}

//Login API & last login API
router.post('/login', passport.authenticate('local', {}), apiResponse('Unit', 'saveDateAfterLogin', false, ['user.name', 'user.username', 'user.is_branch', 'user.uid', 'user.is_kitchen']));
router.post('/loginCheck', apiResponse('Unit', 'loginCheck', false, ['body.username', 'body.password']));
router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200)
});
router.get('/validUser', apiResponse('Unit', 'afterLogin', false, ['user.name', 'user.username', 'user.is_branch', 'user.is_kitchen']));

//checks to be sure users are authenticated
router.all("*", function(req, res, next){
  if (!req.user && req.originalUrl.indexOf('login') === -1 && req.originalUrl.indexOf('validUser') === -1 )
    res.sendStatus(403);
  else
    next();
});
//Unit API
router.put('/unit', apiResponse('Unit', 'insert', true, ['body']));
router.get('/unit', apiResponse('Unit', 'select', false, ['query.isBranch', 'query.isKitchen']));
router.post('/unit/:uid', apiResponse('Unit', 'update', true, ['params.uid', 'body']));
router.delete('/unit/:uid', apiResponse('Unit', 'delete', true, ['params.uid']));
//Product API
router.put('/product', apiResponse('Product', 'insert', true, ['body']));
router.get('/product', apiResponse('Product', 'select', true, ['user.username'], undefined));
router.post('/product/:pid', apiResponse('Product', 'update', true, ['body', 'params.pid', 'user.username']));
router.delete('/product/:pid', apiResponse('Product', 'delete', true, ['params.pid', 'user.username']));
//Override API
router.get('/override', apiResponse('Product', 'select', false, ['user.username', 'query.uid', 'user.uid']));
router.post('/override/:pid', apiResponse('Product', 'update', false, ['body', 'params.pid', 'user.username', 'query.uid', 'user.uid']));
router.delete('/override/:pid', apiResponse('Product', 'delete', false, ['params.pid', 'user.username', 'query.uid', 'user.uid']));
//Stock API
router.get('/stock/:date', apiResponse('Stock', 'select', false, ['user.uid','params.date', 'query.uid']));
router.put('/stock', apiResponse('Stock', 'saveData', false, ['body', 'user.uid']));
router.post('/stock/:bsddid', apiResponse('Stock', 'saveData', false, ['body', 'user.uid', 'params.bsddid']));
router.put('/stock/batch', apiResponse('Stock', 'batchCU', false, ['body', 'user.uid']));
//Delivery API
router.get('/delivery/:date/:branchId', apiResponse('Stock', 'deliverySelect', false, ['user.uid', 'params.branchId', 'params.date', 'user.is_kitchen']));
router.put('/delivery/:uid', apiResponse('Stock', 'saveData', false, ['body', 'params.uid']));
router.post('/delivery/:bsddid', apiResponse('Stock', 'saveData', false, ['body', 'notUsed', 'params.bsddid']));

router.get('/reports/delivery/:start_date/:end_date', apiResponse('Stock', 'deliveryReport', true,
    ['params.start_date', 'params.end_date']));
router.get('/reports/branch_delivery/:branchId/:start_date/:end_date', apiResponse('Stock', 'deliveryReport', true,
    ['params.start_date', 'params.end_date', 'params.branchId']));
module.exports = router;