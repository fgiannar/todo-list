
(function() {
    var app, express, passport;
    
    passport = require('passport');

    express = require('express');

    app = express();

    app.configure(function () {
        app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.static('public'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'keyboard cat' }));
        app.use(passport.initialize());
        app.use(passport.session());
    });

    //default: login
    app.post('/', require('./controllers/user_auth').auth);
    //get all lists (mine and shared)
    app.get('/lists',  require('./controllers/lists').getAll);
    //get all my lists
    app.get('/lists/mine', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').getAllMine);
    //get all the lists that other users share with me 
    app.get('/lists/shared', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').getAllShared);
    //get list
    app.get('/lists/:id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').getById);
    //new list  
    app.post('/lists', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').add);
    //update list  
    app.put('/lists/:id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').update);
    //sharelist  
    app.put('/sharelist/:id/:user_id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').share);
    //delete list  
    app.delete('/lists/:id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/lists').remove);

    //add list item
    app.post('/lists/:id/items', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/list_items').add);
    //update list item  
    app.put('/lists/:id/items/:item_id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/list_items').update);
    //delete list item
    app.delete('/lists/:id/items/:item_id', passport.authenticate('local', { failureRedirect: '/' }), require('./controllers/list_items').remove);

    app.listen(3000);

}).call(this);
