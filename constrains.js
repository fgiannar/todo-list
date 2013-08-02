//check rights
module.exports.hasRights = function(rights, access) {
	return rights.some(function(elem) {
		console.log(elem.user_id ,elem.access, access );
		return (access >= 0) ? elem.user_id === "1" && elem.access === access : elem.user_id === "1";
	});
};

module.exports.mergeUpdates = function (list, item) {
	list.updatedAt = new Date();
	list.rights = item.rights;
	list._id = item._id;
	list.createdAt = item.createdAt;	
	return list;
};