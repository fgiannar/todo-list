/* jslint node: true */
"use strict";


var connection, mongo, constrains;
mongo = require('mongodb');
connection = require('../connection');
constrains = require('../constrains');


module.exports.add = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var list_item = req.body;

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id
            }, function (err, item) {
                if (err) {
                    return res.send("An error has occured");
                }
                if (!item) {
                    return res.send("List not found", 404);
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights)) {
                    return res.send("Access denied", 401);
                }

                list_item._id = new mongo.BSONPure.ObjectID();
                list_item.createdAt = new Date();
                list_item.updatedAt = "";

                collection.update({
                    '_id': id
                }, {
                    $push: {
                        listItems: list_item
                    },
                    $set: {
                        "updatedAt": new Date()
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        console.log('Error adding list item: ' + err);
                        res.send({
                            'error': 'An error has occurred'
                        });
                    } else {
                        res.send(list_item, 201);
                    }
                });
            });
        });
    });
};

module.exports.update = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var item_id = new mongo.BSONPure.ObjectID(req.params.item_id);
    var list_item = req.body;

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id,
                'listItems._id': item_id
            }, {
                rights: 1,
                listItems: {
                    $elemMatch: {
                        _id: item_id
                    }
                }
            }, function (err, item) {
                if (err) {
                    return res.send("An error has occured");
                }

                if (!item) {
                    return res.send("List not found", 404);
                }

                //check rights
                console.log(item);
                if (!constrains.hasRights(req.user._id, item.rights)) {
                    return res.send("Access denied", 401);
                }

                list_item = constrains.mergeItemUpdates(list_item, item);

                collection.update({
                    '_id': id,
                    'listItems._id': item_id
                }, {
                    $set: {
                        'listItems.$': list_item
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        console.log('Error updating list item: ' + err);
                        res.send({
                            'error': 'An error has occurred'
                        });
                    } else {
                        console.log('' + result + ' document(s) updated');
                        res.send(result);
                    }
                });
            });
        });
    });
};

module.exports.remove = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var item_id = new mongo.BSONPure.ObjectID(req.params.item_id);

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id,
                'listItems._id': item_id
            }, function (err, item) {
                if (err) {
                    return res.send("An error has occured");
                }

                if (!item) {
                    return res.send("List not found", 404);
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights)) {
                    return res.send("Access denied", 401);
                }

                collection.update({
                    '_id': id
                }, {
                    $pull: {
                        'listItems': {
                            '_id': item_id
                        }
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        res.send({
                            'error': 'An error has occurred - ' + err
                        });
                    } else {
                        console.log('' + result + ' list items(s) deleted');
                        res.send("List item deleted");
                    }
                });
            });
        });
    });
};
