const lib = require('../lib');
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET api listing. */
function apiResponse(className, functionName, adminOnly=false, reqFuncs=[]){
  let args = Array.prototype.slice.call(arguments, 4);
  let deepFind = function(obj, path){
    path = path.split('.');
    let len=path.length;
    for (let i=0; i<len; i++){
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

      args = dynamicArgs.concat(args);
      lib[className].test = req.test;
      let isStaticFunction = typeof lib[className][functionName] === 'function';
      let model = isStaticFunction ? lib[className] : new lib[className](req.test);
      model[functionName].apply(isStaticFunction?null:model, args)
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
//Login API
router.post('/login', passport.authenticate('local', {}), (req,res)=>res.status(200).send(req.user.username));
router.post('/loginCheck', apiResponse('Unit', 'loginCheck', false, ['body.username', 'body.password']));
router.get('/logout', (req,res)=>{req.logout();res.sendStatus(200)});
router.get('/validUser',(req,res)=>{req.user ? res.status(200).send(req.user.username) : res.sendStatus(400);});
//Unit API
router.put('/unit', apiResponse('Unit', 'insert', true, ['body']));
router.get('/unit', apiResponse('Unit', 'select', true, ['query.isBranch']));
router.post('/unit/:uid', apiResponse('Unit', 'update', true, ['params.uid','body']));
router.delete('/unit/:uid', apiResponse('Unit', 'delete', true, ['params.uid']));
//Product API
router.put('/product', apiResponse('Product', 'insert', true, ['body']));
router.get('/product', apiResponse('Product', 'select', false, ['query.uid']));
router.post('/product/:pid', apiResponse('Product', 'update', false, ['body', 'params.pid', 'query.uid']));
router.delete('/product/:pid', apiResponse('Product', 'delete', false, ['body', 'params.pid', 'query.uid']));

module.exports = router;