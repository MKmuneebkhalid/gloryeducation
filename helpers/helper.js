/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /helpers/helper.js
 * @name : Helper Library
 ************************************************/
"use strict";

require("dotenv").config();

const util = require("../lib/util");
const Constants = require("../constants/constants");
const dialCodes = require('./CountryCodes.json');
const randomstring = require('randomstring');
const flags = require('./flags.json');




const getCountryDialCode = (ccode) =>{
   let ccRow =  dialCodes.filter((s)=>{
        return s.code === ccode;
    });
    return ccRow[0].dial_code;
};

const logger = (key,value) => {
    if (process.env.ENV === 'development') {
        !key || key === undefined ? console.log(value) : console.log(key,value);
    }
};

const geoIPLookUp = () =>{
    return new Promise((reject,resolve) =>{

    $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        console.log('Country Code - ', countryCode);
        callback(countryCode);
        resolve(countryCode);
    });
    });
};

const setFlash = (message,type,group)=>{
    let flashMessage = {
        message,
        type,
        group
    }
    return JSON.stringify(flashMessage);
};

const generateUniqueId = ()=>{
    const random = 'abcdefghijklmnopqrstuvwxyz123456789'
    const size = 8
    let code = ""

    for(let i = 1; i < size; i++) {
        code += random[Math.abs(Math.floor(Math.random() * random.length))]
    }
    return code;
};

const  bytesToSize = (bytes)=> {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}



const loadCountryFlag = () =>{
    return flags;
};


module.exports = {
    getCountryDialCode, logger, geoIPLookUp, setFlash,generateUniqueId,bytesToSize,loadCountryFlag
}