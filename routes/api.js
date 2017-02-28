const lib = require('../lib');
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET api listing. */
function apiResponse(className, functionName, adminOnly=false, reqFuncs=[]){
  let args = Array.prototype.slice.call(arguments, 4);
  let deepFind = function(obj, pathStr){
    let path = pathStr.split('.');
    let len=path.length;
    for (let i=0; i<len; i++){
      if(typeof obj === 'undefined') {
        let err = new Error(`Bad request: request.${pathStr} is not found at '${path[i]}'`);
        err.status = 400;
        throw(err);
      }
      obj = obj[path[i]];
    }
    return obj;
  };
  return(function(req, res) {
    let user = req.user ? req.user.username : req.user;
    req.test = lib.helpers.isTestReq(req);
    if(adminOnly && !lib.helpers.adminCheck(user)) {
      res.status(403)
        .send('Only admin can do this.');
    }
    else {
      let dynamicArgs = [];
      for(let i in reqFuncs)
        dynamicArgs.push((typeof reqFuncs[i]==='function') ? reqFuncs[i](req) : deepFind(req,reqFuncs[i]));

      let allArgs = dynamicArgs.concat(args);
      lib[className].test = req.test;
      let isStaticFunction = typeof lib[className][functionName] === 'function';
      let model = isStaticFunction ? lib[className] : new lib[className](req.test);
      model[functionName].apply(isStaticFunction?null:model, allArgs)
        .then(data=> {
          res.status(200)
            .json(data);
        })
        .catch(err=> {
            console.log(`${className}/${functionName}: `, err.message);
            res.status(err.status||500)
              .send(err.message || err);
          });
    }
  });
}

router.get('/', function(req, res) {
  res.send('respond with a resource');
});
//Login API & last login API
router.post('/login', passport.authenticate('local', {}), apiResponse('Unit', 'saveDateAfterLogin', false, ['user.username','user.is_branch','user.uid']));
router.post('/loginCheck', apiResponse('Unit', 'loginCheck', false, ['body.username', 'body.password']));
router.get('/logout', (req,res)=>{req.logout();res.sendStatus(200)});
router.get('/validUser',apiResponse('Unit', 'afterLogin', false, ['user.username','user.is_branch']));
//Unit API
router.put('/unit', apiResponse('Unit', 'insert', true, ['body']));
router.get('/unit', apiResponse('Unit', 'select', true, ['query.isBranch']));
router.post('/unit/:uid', apiResponse('Unit', 'update', true, ['params.uid','body']));
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
module.exports = router;