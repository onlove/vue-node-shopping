var express = require('express');
var router = express.Router();
require('../util/util.js');
var mongoose = require('mongoose');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge: 1000 * 60 * 60
        });
        //req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
});

router.post('/logout', (req, res) => {
  res.cookie("userId", '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});

router.get('/getCartCount', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result:''
        });
      } else {
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map((item) => {
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: 0,
          msg: '',
          result: cartCount
        });
      }
    })
  }
})

router.get('/cartList', (req, res) => {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
});

router.post('/cartDel', function (req, res) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({userId: userId}, {
    $pull: {'cartList': {'productId': productId}}
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
});

router.post('/cartEdit', (req, res) => {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
});
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item)=> {
          item.checked = checkAll;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1, message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  });
});
router.get('/addressList', (req, res) => {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      });
    }
  })
})

router.post('/setDefault', (req, res) => {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save((err1, doc1) => {
        if (err) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          });
        }
      })
    }
  })
});

router.post('/delAddress', (req, res) => {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.update({userId: userId}, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
});

router.post('/payMent', (req, res) => {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  var orderTotal = req.body.orderTotal;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var address = '', goodsList = [];
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })

      doc.cartList.filter((item)=> {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2;

      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      };

      doc.orderList.push(order);

      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: "0",
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  })
})
router.get('/orderDetail', (req, res) => {
  var userId = req.cookies.userId,
      orderId = req.param("orderId");
  User.findOne({userId: userId}, function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var orderList = userInfo.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          });
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        });
      }
    }
  })
})


module.exports = router;
