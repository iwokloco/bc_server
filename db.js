var mysql = require('mysql');
var pool = null;

function init(params) {
    pool =  mysql.createPool(params);
}

function connect(tag, res, onGetConnection){
    try{
        pool.getConnection(onGetConnection);
    }catch(ex){
        console.log(ex);
        res.json({error: ex, type: error.ERROR_MYSQL_POOL, func: tag});
    }
}

exports.init = init;
exports.connect = connect;