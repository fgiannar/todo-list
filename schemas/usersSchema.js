/* jslint node: true */
"use strict";

function UsersSchema () {
	return	{
		'id': '/Users',
		'type': 'object',
		'properties': {

			'email': {
				'type': 'string',
				'required':true,
				'format': 'email'
			},
			'password': {
				'type': 'string',
				'required':true,
				'minLength': 6
			}

		}
	};
};

module.exports = UsersSchema;