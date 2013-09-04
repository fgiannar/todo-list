/* jslint node: true */
"use strict";


var connection, mongo, constrains;
mongo = require('mongodb');
connection = require('../connection');
constrains = require('../constrains');

module.exports.getById = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': new mongo.BSONPure.ObjectID(id)
            }, function (err, item) {
                if (!item) {
                    res.send("List not found");
                    return;
                }

                //check rights
                if (constrains.hasRights(req.user._id, item.rights)) {
                    res.send(item);
                } else {
                    res.send("Access denied");
                }

            });
        });
    });
};

module.exports.getAll = function (req, res, next) {
    console.info(req);
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.find({
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
            }).toArray(function (err, items) {
                if (err) {
                    res.send("An error has occured");
                    return;
                }
                
                if (!items) {
                    res.send("Lists not found");
                    return;
                }
                res.send(items);
            });
        });
    });
};

module.exports.getAllMine = function (req, res, next) {
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.find({
                rights: {
                    $elemMatch: {
                        user_id: req.user._id,
                        access: 0
                    }
                }
            }).toArray(function (err, items) {
                if (err) {
                    res.send("An error has occured");
                    return;
                }

                if (!items) {
                    res.send("Lists not found");
                    return;
                }
                res.send(items);
            });
        });
    });
};

module.exports.getAllShared = function (req, res, next) {
    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.find({
                rights: {
                    $elemMatch: {
                        user_id: req.user._id,
                        access: 1
                    }
                }
            }).toArray(function (err, items) {
                if (!items) {
                    res.send("Shared lists not found");
                    return;
                }
                res.send(items);
            });
        });
    });
};

module.exports.add = function (req, res, next) {
    var list = req.body;
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
                    res.send(result[0]);
                }
            });
        });
    });
};

module.exports.update = function (req, res, next) {
    var id = new mongo.BSONPure.ObjectID(req.params.id);
    var list = req.body;

    return connection(function (db) {
        db.collection('lists', function (errCollection, collection) {
            collection.findOne({
                '_id': id
            }, function (err, item) {
                if (err) {
                    res.send("An error has occured");
                    return;
                }

                if (!item) {
                    res.send("List not found");
                    return;
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights)) {
                    res.send("Access denied");
                    return;
                }

                list = constrains.mergeListUpdates(list, item);

                collection.update({
                    '_id': id
                }, list, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                        console.log('Error updating list: ' + err);
                        res.send({
                            'error': 'An error has occurred'
                        });
                    } else {
                        console.log('' + result + ' document(s) updated');
                        res.send(list);
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
                    res.send("An error has occured");
                    return;
                }

                if (!item) {
                    res.send("List not found");
                    return;
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights, 0)) {
                    res.send("Access denied");
                    return;
                }

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
                    res.send("An error has occured");
                    return;
                }

                if (!item) {
                    res.send("List not found");
                    return;
                }

                //check rights
                if (!constrains.hasRights(req.user._id, item.rights, 0)) {
                    res.send("Access denied");
                    return;
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
