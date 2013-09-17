/* jslint node: true */
"use strict";

function ListItemsSchema () {
	return	{
		'id': '/ListItems',
		'properties': 
		{	
			'_id': {
				'type': 'string',
				'required': true,
				'readonly': true
			},
			'name': {
				'type': 'string',
				'required': true
			},
			'type': {
				'type': 'string'
				 
			},
			'notes': {
				'type': 'string'
				 
			},
			'quantity': {
				'type': 'integer',
				'minimum': 0
			},
			'isActive': {
				'type': 'boolean'
			},
			'createdAt': {
				'type': 'date',
				'readonly': true
			},
			'updatedAt': {
				'type': 'date',
				'readonly': true
			}
		}
		
	};
};

modules.exports = ListItemsSchema;