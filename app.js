/* jslint node: true */
"use strict";


var app, express;


express = require('express');

app = express();

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.static('public'));
    app.use(express.bodyParser());
});
//register
app.get('/register', require('./controllers/user_auth').register);
//authenticate before anything else
app.all('*', require('./controllers/user_auth').auth_user);
//default:
app.get('/', require('./controllers/lists').getLists);
//get all lists (mine and shared)
app.get('/lists', require('./controllers/lists').getLists);
//get list
app.get('/lists/:id', require('./controllers/lists').getById);
//new list
app.post('/lists', require('./controllers/lists').add);
//update list
app.put('/lists/:id', require('./controllers/lists').update);
//delete list
app.delete('/lists/:id', require('./controllers/lists').remove);

//add list item
app.post('/lists/:id/items', require('./controllers/list_items').add);
//update list item
app.put('/lists/:id/items/:item_id', require('./controllers/list_items').update);
//delete list item
app.delete('/lists/:id/items/:item_id', require('./controllers/list_items').remove);

app.listen(3000);
