'use strict';

const MongoClient   = require('mongodb').MongoClient;
const url           = 'mongodb://admin:admin123@localhost:27017';
const dbName        = 'backthrough';

let Q   = require('q');

class DbHandler {
    constructor(database) {
        this.database = database;
        this.connect(database);
    }

    connect(database) {
        let deferred = Q.defer();
        if(this.db) {
            return this.db;
        }
        MongoClient.connect(url, (err, client) => {
            if(err) {
                deferred.reject(err);
            } else {
                this.db = client.db(database);
                deferred.resolve(this.db);
            }
        });
        return deferred.promise;
    }

    save(collection, data) {
        let deferred = Q.defer();
        Q(this.connect(this.database))
        .then(db => {
            this.db.collection(collection).insert(data, (error, obj) => {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(obj.ops[0]);
                }
            });
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    async findAll(collection, filter) {
        let deferred = Q.defer();
        Q(this.connect(this.database))
        .then(db => {
            this.db.collection(collection).find(filter).toArray((error, obj) => {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(obj);
                }
            });
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    async findOne(collection, filter) {
        let deferred = Q.defer();
        Q(this.connect(this.database))
        .then(db => {
            this.db.collection(collection).find(filter).toArray((error, obj) => {
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(obj[0]);
                }
            });
        }).fail(error => {
            deferred.reject(error);
        })
        return deferred.promise;
    }
}

module.exports = function(database) {
    return new DbHandler(database);
};