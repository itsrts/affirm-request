'use strict';

const Server = require('./server/expressServer');

let 
    server = new Server(),
    api = require('./api')(server);


server.start(8080);