/* jslint node: true */
"use strict";

var rightsSchema = {
		allowAdditionalPropetries: false,
		fields: [
			{
				'_id': {
					type: String,
					optioanal: false
				},
				'access': {
					type: Number,
					optional: false,
					rule: function (v) {
						return (v == 0 || v == 1) ? v : false;
					}
				}
			}
		]
};

var listsSchema = {
		allowAdditionalPropetries: false,
		fields: [
			{
				'name': {
					type: String,
					optioanal: false
				},
				'type': {
					type: String,
					optional: true
				},
				'description': {
					type: String,
					optional: true
				}
				'rights': rightsSchema,
				'createdAt': {
					type: Date,
					optional: false
				},
				'updatedAt': {
					type: Date,
					optional: false
				}
			}
		]
};

var listItemsSchema = {
		allowAdditionalPropetries: false,
		fields: [
			{
				'name': {
					type: String,
					optioanal: false
				},
				'type': {
					type: String,
					optional: true
				},
				'quantity': {
					type: Number,
					optional: true,
					rule: function (v) {
						return (/^\d+$/).test(v) ? v : false;
					}
				},
				'notes': {
					type: String,
					optional: true
				},
				'isActive': {
					type: Boolean,
					optional: true
				},
				'createdAt': {
					type: Date,
					optional: false
				},
				'updatedAt': {
					type: Date,
					optional: false
				}
			}
		]
};

modukes.exports.getSchemaByName = function(name) {
	switch name {
		case 'lists': return listsSchema;
		case 'listItems': return listItemsSchema;
		default: return;
	}
};