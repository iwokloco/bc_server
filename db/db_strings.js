var pool = require('./params').pool;
var error = require('../error');
var app = require('../app');

const SQL_SELECT_STRINGS = "SELECT * FROM strings LIMIT 50";
function getFirstStrings(req, res){
	
    var conn = null;

    function onGetConnection(err, connection){
    	if(err)
    		res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: "getFirstStrings"});
    	else{
        	conn = connection;
            connection.query(SQL_SELECT_STRINGS, null, onSelectStrings);	
    	}
    }	

    function onSelectStrings(err, rows, fields){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: "getFirstStrings/onSelectStrings"});
        else
            res.json(rows);
        conn.release();		
    }

    try{
        pool.getConnection(onGetConnection);		
    }catch(ex){
    	console.log(ex);
        res.json({error: ex, type: error.ERROR_MYSQL_POOL, func: "getFirstStrings"});
    }		
}

exports.getFirstStrings = getFirstStrings;

/*****************************************************************************************/

const SQL_INSERT_STRINGS = "INSERT INTO strings VALUES (?)";
function insertString(req, res){
	
    var conn = null;

    console.log(req.body.id + " " + req.body.value);
    
    function onGetConnection(err, connection){
    	if(err)
    		res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: "insertString"});
    	else{
        	conn = connection;
            connection.query(SQL_INSERT_STRINGS,[[req.body.id, req.body.value]], onInsertString);
    	}
    }	

    function onInsertString(err, result){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: "insertString/onInsertString"});
        else
        	res.json("1");
        conn.release();		
    }

    try{
        pool.getConnection(onGetConnection);		
    }catch(ex){
    	console.log(ex);
        res.json({error: ex, type: error.ERROR_MYSQL_POOL, func: "insertString"});
    }		
}
exports.insertString = insertString;


function get_string(req, res){
    res.json("get_string");
}

function get_strings(req, res){
    res.json("get_strings");
}

function add_string(req, res){
    res.json("add_string");
}

function set_string(req, res){
    res.json("set_string");
}

function remove_string(req, res){
    res.json("remove_string");
}


exports.get_string = get_string;
exports.get_strings = get_strings;
exports.add_string = add_string;
exports.set_string = set_string;
exports.remove_string = remove_string;
