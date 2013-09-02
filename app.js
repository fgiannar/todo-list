
(function() {
    var app, express;
    

    express = require('express');

    app = express();

    app.configure(function () {
        app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.static('public'));
        app.use(express.bodyParser());
    });

    //default:
    app.get('/',  require('./controllers/user_auth').auth_user, require('./controllers/lists').getAll);
    //get all lists (mine and shared)
    app.get('/lists',  require('./controllers/user_auth').auth_user, require('./controllers/lists').getAll);
    //get all my lists
    app.get('/lists/mine', require('./controllers/user_auth').auth_user, require('./controllers/lists').getAllMine);
    //get all the lists that other users share with me 
    app.get('/lists/shared', require('./controllers/user_auth').auth_user, require('./controllers/lists').getAllShared);
    //get list
    app.get('/lists/:id', require('./controllers/user_auth').auth_user, require('./controllers/lists').getById);
    //new list  
    app.post('/lists', require('./controllers/user_auth').auth_user, require('./controllers/lists').add);
    //update list  
    app.put('/lists/:id', require('./controllers/user_auth').auth_user, require('./controllers/lists').update);
    //sharelist  
    app.put('/sharelist/:id/:user_id', require('./controllers/user_auth').auth_user, require('./controllers/lists').share);
    //delete list  
    app.delete('/lists/:id', require('./controllers/user_auth').auth_user, require('./controllers/lists').remove);

    //add list item
    app.post('/lists/:id/items', require('./controllers/user_auth').auth_user, require('./controllers/list_items').add);
    //update list item  
    app.put('/lists/:id/items/:item_id', require('./controllers/user_auth').auth_user, require('./controllers/list_items').update);
    //delete list item
    app.delete('/lists/:id/items/:item_id', require('./controllers/user_auth').auth_user, require('./controllers/list_items').remove);

    app.listen(3000);

}).call(this);
