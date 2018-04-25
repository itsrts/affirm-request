'use strict';

const Q     = require('q');
let _       = require('lodash');
let v       = require('../lib/schemaValidator');

class BaseRequest {

    constructor(server, method, path) {
        this.requestSchema = null;
        server.add(method, path, (request, response) => {
            this.execute(request, response);
        });
        console.log("route added", method, path);
    }

    setRequestBodySchema(requestSchema) {
        this.requestSchema = requestSchema;
        return this;
    }

    /**
     * The function resolves a promise if there is not requestSchema
     * Else it validates the passed JSON with the requestSchema
     * @param {JSON} body the json body to be validated
     */
    async sanityChecks(body) {
        if(this.requestSchema) {
            let result   = v.validate(body, this.requestSchema);
            if(!result.valid) {
                return Q.reject( {
                    code    :   412,
                    message :   result.error
                });
            } else {
                return Q.resolve();
            }
        } else {
            return Q.resolve();
        }
    }

    /**
     * Do any db updations or other steps to be process to fulfill the request
     * @param {*} request 
     * @param {JSON} body 
     */
    async doProcess(request, body) {
        return body;
    }

    async makeResponse(request, body, info) {
        return info;
    }

    async makeError(request, body, error) {
        return Q.resolve({
            code    : 400,
            message : error
        });
    }

    /**
     * Used to support, async process.
     * The process doesn't concern the sync response sent with the request
     * 
     * @param {*} request 
     * @param {JSON} body 
     * @param {JSON} info 
     */
    async postProcess(request, body, info) {
        return Q.resolve({});
    }

    async execute(request, response) {
        let 
            body    = request.body || {},
            query   = request.query || {},
            params  = request.params || {},
            data    = {},
            info    = {},
            res     = {};

        _.extend(body, query, params);
        try {
            await this.sanityChecks(body);
            info    = await this.doProcess(request, body);

            res     = await this.makeResponse(request, body, info);

            let formattedResponse = res;
            // check if we have the proper format
            if(!formattedResponse.code) {
                formattedResponse = {
                    code    : 200,
                    body    : res
                }
            }
            response.sendResponse(formattedResponse.code, formattedResponse.body);
        } catch (error) {
            response.sendResponse(error.code || 400, error);
            return;
        }
        this.postProcess(request, body, info);
    }
}

module.exports = BaseRequest;