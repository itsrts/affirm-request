"use strict";

let
    BaseModel   = require('./baseModel');

class Data extends BaseModel {

    constructor(data) {
        super(Data.prototype.tableName, data);
    }

    async doProcessing() {
        /**
         * Hit the API
         */
        throw "TODO";
    }

    markDone() {
        return Data.updateAll(Data.prototype.tableName, this.data, {'status' : 'done'});
    }
  
    passForNext() {
        let noOfTry = this.data.noOfTry;
        noOfTry++;
        return Data.updateAll(Data.prototype.tableName, this.data, {'noOfTry' : noOfTry});
    }

    toString() {
        return this.data.requestid;
    }

    static async findByRequestId(requestId) {
        return Data.findOne(Data.prototype.tableName, {"requestid" : requestId});
    }
    
    static async findAllPending(num) {
        return Data.findAll(Data.prototype.tableName, {"status" : 'pending'}, num);
    }
}

Data.prototype.tableName = "data";

module.exports = Data;