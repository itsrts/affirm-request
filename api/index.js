'use strict';

let 
    Add     = require('./add'),
    Status  = require('./status');

let init    = function(server) {
    new Add(server);
    new Status(server);
}

module.exports = init;