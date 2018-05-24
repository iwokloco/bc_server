var app = require('../app');
var error = require('../error');


const SQL_INSERT_PROJECT = "INSERT INTO project(name) VALUES (?)";
const TAG_add_project = "add_project";
function add_project(req, res){
    var conn = null;
    if(req.body.name!=null && req.body.name.length>0)
        app.dbConnect(TAG_add_project, res, onGetConnection);
    else
        res.json({error: null, type: error.ERROR_REQ_MISSING_A_PARAMETER, func: TAG_add_project});

    function onGetConnection(err, connection){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: TAG_add_project+"/onGetConnection"});
        else{
            conn = connection;
            connection.query(SQL_INSERT_PROJECT, [[req.body.name]], onInsertProject);
        }
    }

    function onInsertProject(err, result){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: TAG_add_project+"/onInsertProject"});
        else
            res.json("1");
        conn.release();
    }
}

const SQL_SELECT_PROJECTS = "select p.id id_project, p.name project_name, p_lang.id_lang, lang.name, lang.code from project p, project_lang p_lang, languages lang where p.id=1 and p_lang.id_project=p.id and lang.id=p_lang.id_lang";
const TAG_get_projects = "get_projects";
function get_projects(req, res){
    var conn = null;
    app.dbConnect(TAG_get_projects, res, onGetConnection);
    function onGetConnection(err, connection){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: TAG_get_projects+"/onGetConnection"});
        else{
            conn = connection;
            connection.query(SQL_SELECT_PROJECTS, null, onSelectProjects);
        }
    }

    function onSelectProjects(err, rows, fields){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: TAG_get_projects+"/onSelectProjects"});
        else
            res.json(rows);
        conn.release();
    }
}

const SQL_UPDATE_PROJECT = "update project set name=? where id=?";
const TAG_set_project = "set_project";
function set_project(req, res){
    var conn = null;
    app.dbConnect(TAG_set_project, res, onGetConnection);
    function onGetConnection(err, connection){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: TAG_set_project+"/onGetConnection"});
        else{
            conn = connection;
            connection.query(SQL_UPDATE_PROJECT, [req.body.name, req.body.id], onUpdateProject);
        }
    }
    function onUpdateProject(err, result){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: TAG_set_project+"/onUpdateProject"});
        else
            res.json(result);
        conn.release();
    }
}

function remove_project(req, res){
    res.json("remove_project");
}

exports.add_project = add_project;
exports.get_projects = get_projects;
exports.set_project = set_project;
exports.remove_project = remove_project;