'use strict';

let Q           = require('q');

let dbHandler   = require('../lib/dbHandlerInMemory')('affirm');

class BaseModel {

    constructor(table, data) {
        this.tableName  = table;
        this.data       = data;
    }

    async save() {
        return await dbHandler.save(this.tableName, this.data);
    }

    static async findAll(table, filter) {
        return await dbHandler.findAll(table, filter);
    }

    static async findOne(table, filter) {
        return dbHandler.findOne(table, filter);
    }

}

module.exports = BaseModel;