'use strict';

let AJV         = require('ajv');

class SchemaValidator {
    constructor() {
        this.ajv            = new AJV({ coerceTypes: true });
    }

    validate(data, schema) {

        let result = this.ajv.validate(schema, data);

        if(!result) {
            let message = this.ajv.errorsText().replace(/'/g, "").replace("data ", "");
            return {valid : false, error : message};
        } else {
            return {valid : true, error : "No errors"};
        }
    }
}

module.exports = new SchemaValidator();