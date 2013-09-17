/* jslint node: true */
"use strict";


var connection, mongo, constrains;
mongo = require('mongodb');
connection = require('../connection');
constrains = require('../constrains');

module.exports.getById = function (req, res, next) {
    var item_id = new mongo.BSONPure.ObjectID(req.params.item_id);

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                'listItems._id': item_id
            }, {
                //TODO: find out why this doesn't work as it should
                /*'listItems.$':1
                rights: 1,
                listItems: {
                    $elemMatch: {
                        _id: item_id
                    }
                }*/
            }, function (err, item) {
                if (err) {
                    return res.send(err);
                }
                if (!item) {
                    return res.send("List item not found", 404);
                }
                //check rights
                if (constrains.hasRights(req.user._id, item.rights)) {
                    var ListsItemsSchema = new require('../schemas/ListItemsSchema')();
                    var validationErrors = require('jsonschema').validate(query, ListsItemsSchema).errors;

                    if (validationErrors.length > 0) {
                        return res.send(validationErrors, 400);
                    } else {
                        res.send(item);
                    }
                } else {
                    res.send("Access denied", 401);
                }

            });
        });
    });
};


module.exports.add = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var list_item = req.body;

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id
            }, function (err, item) {
                if (err) {
                    return res.send(err);
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
                        return res.send(err);
                    } else {
                        res.send(list_item, 201);
                    }
                });
            });
        });
    });
};

module.exports.update = function (req, res, next) {
    var item_id = new mongo.BSONPure.ObjectID(req.params.item_id);
    var list_item = req.body;

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                'listItems._id': item_id
            }, {
                /*
                rights: 1,
                listItems: {
                    $elemMatch: {
                        _id: item_id
                    }
                }
            */
            }, function (err, item) {
                if (err) {
                   return res.send(err);
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
                    'listItems._id': item_id
                }, {
                    $set: {
                        'listItems.$': list_item
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                       return res.send(err);
                    } else {
                        res.send(list_item);
                    }
                });
            });
        });
    });
};

module.exports.remove = function (req, res, next) {
    var item_id = new mongo.BSONPure.ObjectID(req.params.item_id);

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                'listItems._id': item_id
            }, function (err, item) {
                if (err) {
                   return res.send(err);
                }

                if (!item) {
                    return res.send("List not found", 404);
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights)) {
                    return res.send("Access denied", 401);
                }

                collection.update({
                    'listItems._id': item_id
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
                       return res.send(err);
                    } else {
                        console.log('' + result + ' list items(s) deleted');
                        res.send("List item deleted");
                    }
                });
            });
        });
    });
};
