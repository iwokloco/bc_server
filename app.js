var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var api = require('./api/api');
var db_project = require('./db/db_project'),
	db_project_lang = require('./db/db_project_lang'),
	db_strings = require('./db/db_strings'),
	db_img = require('./db/db_img'),
	db_category = require('./db/db_category'),
	db_item_attribute = require('./db/db_item_attribute'),
	db_item = require('./db/db_item'),
	db_languages = require('./db/db_languages');

var error = require('./error');
var mysql = require('mysql');

var pug = require('pug');

var cache = new Array();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 1702);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(function(err, req, res, next) {
	if(err){
		console.log(err);
		return res.sendStatus(400);
	}
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/', api.sendEmail);
app.post('/login', api.login);
app.post('/login_admin', login_admin);

app.post('/cms/get_projects', db_project.get_projects);
app.post('/cms/add_project', db_project.add_project);
app.post('/cms/set_project', db_project.set_project);
app.post('/cms/remove_project', db_project.remove_project);

app.post('/cms/get_project_lang', db_project_lang.get_project_lang);
app.post('/cms/add_project_lang', db_project_lang.add_project_lang);
app.post('/cms/remove_project_lang', db_project_lang.remove_project_lang);

app.post('/cms/get_string', db_strings.get_string);
app.post('/cms/get_strings', db_strings.get_strings);
app.post('/cms/add_string', db_strings.add_string);
app.post('/cms/set_string', db_strings.set_string);
app.post('/cms/remove_string', db_strings.remove_string);

app.get('/cms/get_languages', db_languages.getLanguages);

/*
app.post('/cms/get_img', db_strings.insertString);
app.post('/cms/get_imgs', db_strings.insertString);
app.post('/cms/add_img', db_strings.insertString);
app.post('/cms/set_img', db_strings.insertString);
app.post('/cms/remove_img', db_strings.insertString);
app.post('/cms/get_categories', db_strings.insertString);
app.post('/cms/add_category', db_strings.insertString);
app.post('/cms/set_category', db_strings.insertString);
app.post('/cms/remove_category', db_strings.insertString);
app.post('/cms/get_item', db_strings.insertString);
app.post('/cms/add_item', db_strings.insertString);
app.post('/cms/set_item', db_strings.insertString);
app.post('/cms/remove_item', db_strings.insertString);
app.post('/cms/get_item_attribute', db_strings.insertString);
app.post('/cms/add_item_attribute', db_strings.insertString);
app.post('/cms/set_item_attribute', db_strings.insertString);
app.post('/cms/remove_item_attribute', db_strings.insertString);*/

app.post('/*', post);

app.get('/cms/text', writeText);

app.get('/pug/uno', function(){
	var compiled_pug = pug.compileFile('index.pug');
	res.html(compiled_pug({title: "hello!"}));
});

//user: admin, pass: 1702
var ADMIN_MAIL = "iwok";
var ADMIN_PASS = "1234";
var ADMIN_SECRET = "07021986";

var CONFIG = null;


function login_admin(req, res){
	console.log("/login_admin " + req.body.mail);
	if(req.body.mail===ADMIN_MAIL && req.body.pass===ADMIN_PASS){
		res.json({sid : ADMIN_SECRET});
	}else{
		res.json({err : error.ERR_LOGIN_ADMIN});
	}
}

function writeText(req, res){

	addNewLine(req.body);
	
	fs.writeFile(CONFIG.text_file, "Hey there!", function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    res.json("jur");
	});	
}


function addNewLine(text){
	fs.open(CONFIG.text_file, 'a', 666, function( e, id ) {
		fs.write( id, text + "\n", null, 'utf8', function(){
			fs.close(id, function(){
				console.log('file is updated');
			});
		});
	});	
}


function post(req, res){
	if(req.originalUrl[req.originalUrl.length-1]!='/') req.originalUrl+='/';
	var collections = req.originalUrl.split("/");

	try{
		switch(collections.length){
			case 5: // 	["","XF5FUO","my_num","users",""]	/XF5FUO/my_num/users/
				req.token = collections[1];
				req.database = collections[2];
				req.collection = collections[3];
				api.addToCollection(req, res);
				break;
			}
	}catch(e){
		res.json({api_err: error.ERR_POST_UNKNOWN, error: e});
	}

}


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
	fs.readFile(__dirname + "/bestcms.conf", 'utf8', function(err, contents) {
		var config = JSON.parse(contents);
		pool =  mysql.createPool(config.db);
		//console.log(JSON.stringify(config.db));
		//pool =  mysql.createPool({"host":"127.0.0.1","user":"root","password":"iw1702Nena","database":"bestcms","multipleStatements":true});
		
	});
});

var pool = null;

function dbConnect(tag, res, onGetConnection){
	try{
		pool.getConnection(onGetConnection);
	}catch(ex){
		console.log(ex);
		res.json({error: ex, type: error.ERROR_MYSQL_POOL, func: tag});
	}
}

exports.dbConnect = dbConnect;

/*
{
	[
		test: { name: "Insert"
				inorder:[
					{url: "/cms/add_project", body: {name: "Project 00"}, success : { id : $integer } },
					{url: "/cms/get_project", body: {id: $$prev_res.id} , success : { name : "Project 00"}}
				]
		}
	]
}
*/



