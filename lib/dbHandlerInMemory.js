'use strict';

const MongoClient   = require('mongodb').MongoClient;
const url           = 'mongodb://admin:admin123@localhost:27017';
const dbName        = 'backthrough';

let Q   = require('q');
let _   = require('lodash');


/**
 {
     "database" : {
         "collection" : {
             "key"  : {
                 "key"  :   "value"
             }, 
             "key"  : {
                 "key"  :   "value"
             }
        }
     }
 }
 */
let DBS = {};

class DbHandler {
    constructor(database) {
        this.database = database;
        this.connect(database);
    }

    connect(database) {
        if(!DBS[database]) {
            DBS[database]   = {};
        }
        return Q.resolve(DBS[database]);
    }

    save(collection, primaryKey, data) {
        let deferred = Q.defer();
        Q(this.connect(this.database))
        .then(db => {
            if(!db[collection]) {
                db[collection]  = [];
            }
            // extend it so that we can update as well
            let obj = db[collection][primaryKey] || {};
            _.extend(obj, data);
            db[collection][primaryKey] = obj;
            deferred.resolve(data);
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    async findAll(collection, filter, limit = -1) {
        let deferred = Q.defer();
        Q(this.connect(this.database))
        .then(db => {
            if(!db[collection]) {
                db[collection]  = {};
            }
            let result  = [];
            Object.keys(db[collection]).every(primaryKey => {
                let element = db[collection][primaryKey];
                let yes     = true;
                Object.keys(filter).every(key => {
                    yes = element[key] == filter[key];
                    return yes;
                });
                if(yes) {
                    result.push(element);
                }
                return limit == -1 || result.length < limit;
            });
            deferred.resolve(result);
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    async findOne(collection, filter) {
        let deferred = Q.defer();
        Q(this.findAll(collection, filter))
        .then(result => {
            if(result && result[0]) {
                deferred.resolve(result[0]);
            } else {
                deferred.reject('NOT FOUND');
            }
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    async updateAll(collection, filter, data) {
        let deferred = Q.defer();
        Q(this.findAll(collection, filter))
        .then(result => {
            result.forEach(element => {
                _.extend(element, data);
            });
            deferred.resolve();
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }
}

module.exports = function(database) {
    return new DbHandler(database);
};