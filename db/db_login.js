var params = require('./params');
var pool = params.pool;

const SQL_PROCEDURE_LOGIN = "set @token=0;set @id=0;call dbfury.login(?,?,?,?,?,?,@id,@token);select @id, @token;";

function login(callback, req, res){
	var conn = null;

	function callLogin(err, connection){
		conn = connection;
		conn.multipleStatements = true;
		conn.query(SQL_PROCEDURE_LOGIN,[
			req.body.google_profile.sub,
			req.body.google_profile.given_name,
			req.body.google_profile.family_name,
			req.body.google_profile.email,
			req.body.google_profile.locale,
			req.body.google_profile.picture
		], onLogin);
	}
	function onLogin(err, rows, fields){
		callback(err, rows, fields, req, res);
		conn.release();
	}

	try{
		pool.getConnection(callLogin);
	}catch(ex){
		console.log("EX  insertRow : " + ex);
	}
}

exports.login = login;
