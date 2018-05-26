var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser');
var app = express();
require('./routes')(app);
var db = require('./db');
var fs = require('fs');
var error = require('./error');
var mysql = require('mysql');
var pug = require('pug');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

fs.readFile(__dirname + "/bestcms.conf", 'utf8', function(err, contents) {
	initServer(JSON.parse(contents));
});

function initServer(config){
	http.createServer(app).listen(config.port, function(){
		console.log('<-- Server started -->');
		db.init(config.db);
	});
}
