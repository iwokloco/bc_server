var app = require('../app');
var error = require('../error');

function get_project_lang(req, res){
    res.json("get_project_lang");
}

//const SQL_SELECT_PROJECT
function add_project_lang(req, res){
    res.json("add_project_lang");
}

function remove_project_lang(req, res){
    res.json("remove_project_lang");
}

exports.get_project_lang = get_project_lang;
exports.add_project_lang = add_project_lang;
exports.remove_project_lang = remove_project_lang;
