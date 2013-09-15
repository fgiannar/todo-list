/* jslint node: true */
"use strict";


var connection, mongo, constrains, exclude_obj;
mongo = require('mongodb');
connection = require('../connection');
constrains = require('../constrains');
exclude_obj = {
    'listItems': 0
};

module.exports.getById = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id
            }, exclude_obj, function (err, item) {
                if (!item) {
                    return res.send("List not found", 404);
                }
                //check rights
                if (constrains.hasRights(req.user._id, item.rights)) {
                    res.send(item);
                } else {
                    res.send("Access denied", 401);
                }

            });
        });
    });
};

module.exports.getLists = function (req, res, next) {
    var query;
    switch (req.query.type) {
    case 'mine':
        query = {
            rights: {
                $elemMatch: {
                    user_id: req.user._id,
                    access: 0
                }
            }
        };
        break;
    case 'shared':
        query = {
            rights: {
                $elemMatch: {
                    user_id: req.user._id,
                    access: 1
                }
            }
        };
        break;
    default:
        query = {
            $or: [{
                rights: {
                    $elemMatch: {
                        user_id: req.user._id,
                        access: 0
                    }
                }
            }, {
                rights: {
                    $elemMatch: {
                        user_id: req.user._id,
                        access: 1
                    }
                }
            }]
        };

    }
    console.info(req.user._id);
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.find(query, exclude_obj).toArray(function (err, items) {
                if (err) {
                    return res.send("An error has occured");
                }

                if (!items) {
                    return res.send("Lists not found");
                }
                res.send(items);
            });
        });
    });
};



module.exports.add = function (req, res, next) {
    var list = req.body;
    console.log(req.body);
    list.rights = [{
        user_id: req.user._id,
        access: 0
    }];
    if (!list.createdAt)
        list.createdAt = new Date;
    list.listItems = [];
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.insert(list, {
                safe: true
            }, function (err, result) {
                if (err) {
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {

                    console.log('Success: ' + JSON.stringify(result[0]));
                    delete result[0].listItems;
                    res.send(result[0], 201);
                }
            });
        });
    });
};

module.exports.update = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var list = req.body;
    var query;

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
                if (req.query.user_id) {
                    if (!constrains.hasRights(req.user._id, item.rights, 0)) {
                        return res.send("You don't have the rights to share this list");
                    }

                    query = {
                        $push: {
                            rights: {
                                user_id: req.query.user_id,
                                access: 1
                            }
                        }
                    };
                } else {
                    if (!constrains.hasRights(req.user._id, item.rights)) {
                        return res.send("You don't have the rights to edit this list");
                    }
                    query = constrains.mergeListUpdates(list, item);
                }

                collection.update({
                    '_id': id
                }, query, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        console.log('Error updating list: ' + err);
                        res.send({
                            'error': 'An error has occurred'
                        });
                    } else {
                        console.log('' + result + ' document(s) updated');
                        delete result.listItems;
                        res.send(result);
                    }
                });
            });
        });
    });
};

module.exports.share = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var user_id = req.params.user_id;
    var list = req.body;

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


                collection.update({
                    '_id': new mongo.BSONPure.ObjectID(id)
                }, {
                    $push: {
                        rights: {
                            user_id: user_id,
                            access: 1
                        }
                    }
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        console.log('Error updating list: ' + err);
                        res.send({
                            'error': 'An error has occurred'
                        });
                    } else {
                        console.log('' + result + ' document(s) updated');
                        res.send("list shared");
                    }
                });
            });
        });
    });
};

module.exports.remove = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);

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
                if (!constrains.hasRights(req.user._id, item.rights, 0)) {
                    return res.send("Access denied", 401);
                }

                collection.remove({
                    '_id': id
                }, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        res.send({
                            'error': 'An error has occurred - ' + err
                        });
                    } else {
                        console.log('' + result + ' document(s) deleted');
                        res.send("List deleted");
                    }
                });
            });
        });
    });
};
