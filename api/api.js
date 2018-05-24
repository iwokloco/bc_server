var mail = require('./mail');
var api_login = require('./api_login');
var api_add = require('./api_add');

exports.sendEmail = mail.sendEmail;
exports.login = api_login.login;
exports.addToCollection = api_add.addToCollection;