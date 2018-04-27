"use strict";

let 
    Data    = require('../model/data'),
    Q       = require('q');

class Cron {

    constructor() {
        
    }

    updateConsole(str) {
        console.log(str, new Date().toString());
    }

    async start() {
        this.updateConsole("starting off...");
        let req = await this.getNext(10);
        await this.processAll(req);
        setTimeout(() => {
            this.start();
        }, 1000);
    }

    /**
     * Gets the next @num requests to be processed
     * @param {Integer} num 
     */
    getNext(num) {
        this.updateConsole(`getting the next ${num} requests`);
        return Data.findAllPending(num);
    }

    async processAll(req) {
        this.updateConsole(`processing all of the ${req.length} requests`);
        let arr = [];
        req.forEach( element => {
            let data  = new Data(element);
            arr.push(this.processSingle(data));
        });
        await Q.all(arr);
    }

    /**
     * 
     * @param {Data} data 
     */
    async processSingle(data) {
        try {
            this.updateConsole("processing single : "+ data.toString());
            let response = await data.doProcessing();
            await data.markDone(response);
            this.updateConsole("marked done : "+ data.toString());
        } catch (error) {
            this.updateConsole("marked failed : "+ data.toString());
            data.passForNext();
        }
        return {};
    }
}

module.exports = new Cron();