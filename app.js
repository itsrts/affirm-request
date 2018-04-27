'use strict';

const SERVER = require('./server/expressServer');
const CRON = require('./cron');

let 
    server = new SERVER(),
    api = require('./api')(server);


server.start(8080);

try {
    CRON.start();
} catch (error) {
    console.log("Error in Cron : ", error);
}