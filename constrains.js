//check rights
module.exports.hasRights = function(rights, access) {
	return rights.some(function(elem) {
		return (access >= 0) ? elem.user_id === "1" && elem.access === access : elem.user_id === "1";
	});
};

module.exports.mergeListUpdates = function (list, item) {
	list.updatedAt = new Date();
	list.rights = item.rights;
	list._id = item._id;
	list.createdAt = item.createdAt;
	list.listItems = item.listItems;
	return list;
};

module.exports.mergeItemUpdates = function (list_item, item) {
	list_item.updatedAt = new Date();
	list_item._id = item._id;
	list_item.createdAt = item.createdAt;
		
	return list_item;
};