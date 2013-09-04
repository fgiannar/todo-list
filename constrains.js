/* jslint node: true */
"use strict";


//check rights
module.exports.hasRights = function (rights, access) {
    rights.some(function (elem) {
        return (access >= 0) ? elem.user_id === "1" && elem.access === access : elem.user_id === "1";
    });
};

module.exports.mergeListUpdates = function (list, db_item) {
    list.updatedAt = new Date();
    list.rights = db_item.rights;
    list._id = db_item._id;
    list.createdAt = db_item.createdAt;
    list.listItems = db_item.listItems;
    return list;
};

module.exports.mergeItemUpdates = function (list_item, db_item) {
    list_item.updatedAt = new Date();
    list_item._id = db_item._id;
    list_item.createdAt = db_item.createdAt;

    return list_item;
};
