var mysql = require('mysql');

var productionPool  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'iw1702Nena',
  database : "bestcms",
  multipleStatements:true
});

exports.pool = productionPool;
