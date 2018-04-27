'use strict';

let 
    Q               = require('q'),
    BaseRequest     = require('./baseRequest'),
    Data            = require('../model/data');

let schema  = { $id : "/Status", type : "object", properties : {
    requestid       :   { type : "string" }
},
required : ["requestid"]
};

class Status extends BaseRequest {

    constructor(server) {
        super(server, 'GET', '/status');
        this.setRequestBodySchema(schema);
    }

    async doProcess(request, body) {
        // save the request in ES or SQL
        // let defer = Q.defer();
        let d = await Data.findByRequestId(body.requestid);
        return d;
    }

}

module.exports = Status;