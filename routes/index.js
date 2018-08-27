module.exports = function(app){
  var api = require('../api/api');
  var db_project = require('../db/db_project'),
    db_project_lang = require('../db/db_project_lang'),
    db_strings = require('../db/db_strings'),
    db_img = require('../db/db_img'),
    db_category = require('../db/db_category'),
    db_item_attribute = require('../db/db_item_attribute'),
    db_item = require('../db/db_item'),
    db_languages = require('../db/db_languages');
  var fs = require('fs');
  var pug = require('pug');
  var error = require('../error');

  const ADMIN_MAIL = "iwok";
  const ADMIN_PASS = "1234";
  const ADMIN_SECRET = "07021986";


  app.post('/', api.sendEmail);
  app.post('/login', api.login);

  app.post('/login_admin', function(req, res) {
    console.log("hei");
    if(req.body.mail===ADMIN_MAIL && req.body.pass===ADMIN_PASS){
      res.json({sid : ADMIN_SECRET});
    }else{
      res.json({err : error.ERR_LOGIN_ADMIN});
    }
  });

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

  app.post('/*', post);

  app.get('/cms/text', writeText);

  app.get('/pug/uno', function(req, res){
    var compiled_pug = pug.compileFile('./views/index.pug');
    res.html(compiled_pug({title: "hello!"}));
  });


  function writeText(req, res){
    addNewLine(req.body);
    fs.writeFile(app.config.text_file, "Hey there!", function(err) {
        if(err) {
            return console.log(err);
        }
        res.json("jur");
    });	
  }


  function addNewLine(text){
    fs.open(app.config.text_file, 'a', 666, function( e, id ) {
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

}


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