/* jslint node: true */
"use strict";

function ListsSchema () {
	return	{
		'id': '/Lists',
		'type': 'object',
		'properties': {
			'_id': {
				'type': 'string',
				'required': true,
				'readonly': true
			},
			'name': {
				'type': 'string',
				'required':true
			},
			'type': {
				'type': 'string'
				 
			},
			'description': {
				'type': 'string'
				 
			},
			'rights': {
				'type': 'array',
				'readonly': true
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

module.exports = ListsSchema;