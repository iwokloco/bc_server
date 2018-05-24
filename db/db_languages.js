/**
 * Created by iwokloco on 14/03/2018.
 */
var app = require('../app');
var error = require('../error');

const SQL_SELECT_LANGUAGES = "select * from languages";
const TAG_getLanguages = "getLanguages";
function getLanguages(req, res){
    var conn = null;
    app.dbConnect(TAG_getLanguages, res, onGetConnection);

    function onGetConnection(err, connection){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL_CONNECTION, func: TAG_getLanguages+"/onGetConnection"});
        else{
            conn = connection;
            connection.query(SQL_SELECT_LANGUAGES, null, onSelectLanguages);
        }
    }

    function onSelectLanguages(err, rows, fields){
        if(err)
            res.json({error: err, type: error.ERROR_MYSQL, func: "TAG_getLanguages/onSelectStrings"});
        else
            res.json(rows);
        conn.release();
    }
}
exports.getLanguages = getLanguages;