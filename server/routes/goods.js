/**
 * Created by DT274 on 2017/8/28.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/dumall', {useMongoClient: true});

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});


router.get("/", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceLevel = req.param('priceLevel');
  let skip = (page - 1) * pageSize;
  let params = {};

  let priceGt = '';
  let priceLt = '';

  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLt = 100;
        break;
      case '1':
        priceGt = 100;
        priceLt = 200;
        break;
      case '2':
        priceGt = 300;
        priceLt = 500;
        break;
      case '3':
        priceGt = 500;
        priceLt = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lt: priceLt
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

router.post('/addCart', (req, res) => {
  let userId = '100000077';
  let productId = req.body.productId;
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (user) {
        let goodItem = ''
        user.cartList.forEach((item) => {
          if (item.productId == productId) {
            goodItem = item;
            item.productNum++;
          }
        })

        if(goodItem) {
          user.save().then(function(rs) {
            res.json({
              status: '0',
              msg: ''
            });
          })
        } else {
          Goods.findOne({productId: productId}).then((good) => {
            if (good) {
              good.productNum = 1;
              good.checked = 1;
              user.cartList.push(good);
              user.save().then(function(rs) {
                res.json({
                  status: '0',
                  msg: ''
                });
              })
            }
          })
        }
      }
    }
  })
})

module.exports = router;
