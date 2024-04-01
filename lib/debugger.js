/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /util/debugger.js
 * @name :Util Library
 ************************************************/
"use strict";
require("dotenv").config();

const logger = (msg,obj,type) =>{
   let env = process.env.NODE_ENV;
   if(env === 'development'){
        console.log(msg,JSON.stringify(obj, null,4));
   }
    if(env === 'production') {
        if (type === 'error') {
            let json = JSON.stringify(obj, null, 4);
            global.logSentry.error(`${msg} ${json}`);
        }
        if (type === 'info') {
            let _odata = (typeof obj === 'string') ? {value: obj} : obj;
            global.logSentry.info(`${msg}`, _odata);
        }
    }
}

module.exports = { logger };