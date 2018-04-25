"use strict";

let
    BaseModel   = require('./baseModel');

class Data extends BaseModel {

    constructor(data) {
        super('data', data);
    }
}

Data.prototype.tableName = "data";

module.exports = Data;