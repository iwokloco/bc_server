var db_login = require('../db/db_login');
var https = require('https');

const ERROR_GOOGLE_VALIDATION_TOKEN = {err: "Google token not valid"};
const ERROR_DB_LOGIN = {err: "DB login error"};
const ERROR_DB_LOGIN_CATCH = {err: "DB login error catch"};

function login(req, res){
	console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') +"		/login");
	googleValidateToken(onValidToken, req, res);
}

function onValidToken(req, res){
		db_login.login(onDBLogin, req, res);
}

function onDBLogin(err, rows, fields, req, res){
	try{
		if(err){
			res.json({ERROR_DB_LOGIN, err});
		}else{
			res.json({
				name:req.body.google_profile.given_name,
				family_name:req.body.google_profile.family_name,
				locale:req.body.google_profile.locale,
				picture:req.body.google_profile.picture,
				token: rows[3][0]["@token"],
				id:  rows[3][0]["@id"]
			});
		}
	}catch(ex){
		res.json(ex);
	}
}

function googleValidateToken(onValidToken, req, res){ // Pasando el id_token a esta url se puede ver el JSON que devuelve google
	var request = https.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+req.body.id_token, function(gres) {
		if(gres.statusCode == 200){
					gres.setEncoding('utf8');
					let body = "";
					gres.on("data", data => {
						body += data;
					});
					gres.on("end", () => {
						body = JSON.parse(body);
						if(!body.email_verified){
							res.json(ERROR_GOOGLE_VALIDATION_TOKEN);
						}else{
							req.body.google_profile = body;
							onValidToken(req, res);
						}
					});
		}else{
			res.json(ERROR_GOOGLE_VALIDATION_TOKEN);
		}

	});
}


exports.login = login;
