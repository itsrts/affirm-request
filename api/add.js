'use strict';

let 
    _               = require('lodash'),
    MOMENT          = require('moment'),
    BaseRequest     = require('./baseRequest'),
    Data            = require('../model/data');

let schema  = { $id : "/Add", type : "object", properties : {
    requestid       :   { type : "string" },
    vertical        :   { type : "string" },
    url             :   { type : "string" },
    body            :   { type : "object" },
    maxLife         :   { type : "integer"},
    timeDiff        :   { type : "integer"},
    isDayEnd        :   { type : "boolean"}
},
required : ["requestid", "vertical", "url", "body", "maxLife", "timeDiff", "isDayEnd"]
};

class Add extends BaseRequest {

    constructor(server) {
        super(server, 'POST', '/add');
        this.setRequestBodySchema(schema);
    }

    async doProcess(request, body) {
        /**
         * Set the initial values
         */
        let initial = {
            "status"    : "pending",
            "response"  : {},
            "noOfTry"   : 0,
            "createdAt" : new Date(),
            "updatedAt" : new Date()
        }
        _.extend(body, initial);
        // calculate endTime
        let 
            dayEnd  = MOMENT().endOf('day'),
            endTime = MOMENT().add(_.get(body, 'maxLife', 0), 'minutes');
        if(endTime > dayEnd && _.get(body, 'isDayEnd', false) == true) {
            endTime = dayEnd;
        }
        _.set(body, 'endTime', endTime.toString());
        return new Data(body).save();
    }

    makeResponse(request, body, info) {
        return {
            message : "Request Added",
            data    : info
        };
    }
}

module.exports = Add;