/**
 * Created by DT274 on 2017/8/25.
 */
let http = require('http');
let util = require('util');
http.get("http://www.imooc.com/u/card", function(res) {
  let data = '';
  res.on('data', function(chunk) {
    data += chunk;
  })

  res.on('end', function() {
    let result = JSON.parse(data);
    console.log('result:' + result.msg);
  })
})
