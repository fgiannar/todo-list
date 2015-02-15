/* jslint node: true */
"use strict";

//constructor
//using named function to get better stack trace
function Validator (data, schemaName) {
	this.data = data;
	this.schemaName = schemaName;
	this.errors = [];
	this.schema = new Schema(schemaName);
	if (!schema)
		throw new Error("Schema" + schemaName + "does not exist");
};

Validator.prototype.validateData = function () {
	var dataObjKeys = Object.keys(this.data);
	if (!dataObjKeys == []) {
		this.errors.push("Cannot validate empty object"); //maybe should throw error??
		return(this.data, this.errors);
	}

	dataObjKeys.forEach(function(dataKey){
		var schemaField = schema.fields[key];
		if (!schema.allowAdditionalPropetries && !schemaField) {
			this.errors.push(key + "is not included in the" + this.schemaName + "and the schema does not allow additional properties");
		}

		else if (schemaField.type !== typeof dataKey) {
			this.errors.push(dataKey + "should be" + schemaField.type + ". Instaed " + typeof dataKey + " was given.")
		}

		else if (schemaField.rule) {
			if (!schemaField.rule(this.data[key])) {
					this.errors.push(schemaField.rule(this.data[key]));
			} else {
					this.data[key] = schemaField.rule(this.data[key]);
			}
			
		}
	});

	return(this.data, this.errors.length > 0 ? this.errors : null);
};

modules.exports = Validator;
