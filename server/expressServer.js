const Express       = require('express');
const BODYPARSER    = require('body-parser');

class Response {

    constructor(res) {
        this.res    = res;
    }

    sendResponse(statusCode, data) {
        console.log(data);
        
        this.res.status(statusCode).send(data);
    }
}

class Server {

    constructor() {
        this.server   = new Express();
        this.server.use(BODYPARSER.json());
        this.server.use(BODYPARSER.urlencoded({ extended: false }));
    }

    start(port = 8080) {
        this.server.listen(port, () => {
            console.log("server started");
        });
    }

    /**
     * TODO  :  add the other implementations as in hapiServer.js
     */

    /**
     * Adds a new route to the server with the passed handler as the listener
     * @param {string} path 
     * @param {function} handler 
     */
    get(path, handler) {
        this.server.get(path, (req, res) => {
            handler(req, new Response(res));
        });
        return this;
    }

    /**
     * Adds a new route to the server with the passed handler as the listener
     * @param {string} path 
     * @param {function} handler 
     */
    add(method, path, handler) {
        this.server[method.toLowerCase()](path, (req, res) => {
            handler(req, new Response(res));
        });
        return this;
    }

    /**
     * Adds a new POST route to the server with the passed handler as the listener
     * @param {string} path 
     * @param {function} handler 
     */
    post(path, handler) {
        this.server.post(path, (req, res) => {
            handler(req, new Response(res));
        });
        return this;
    }
}

module.exports = Server;