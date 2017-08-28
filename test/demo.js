/**
 * Created by DT274 on 2017/8/25.
 */
let user = require('./User');
console.log(`userName: ${user.username}`);

let http = require('http');
let url = require('url');
let util = require('util');
let server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plan; chartset=uft-8');
  res.end(util.inspect(res));
  //res.end(util.inspect(url.parse(req.url)));
});

server.listen(3000, '127.0.0.1', () => {
  console.log("服务端已运行，请打开浏览器，输入127.0.0.1:3000来访问")
});
