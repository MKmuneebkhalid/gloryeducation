/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /controllers/home.js
 * @name : Home Controller
 ************************************************/
"use strict";

const flash = require('../middleware/flashManager');
const { loadView } = require('../lib/util');


const partnerHome = async (req,res) =>{
    let data = {
        message: flash.flashHandler(req),
        title: 'GES Partners | Home',
        content: await loadView('pages/home')
    };
    res.render('layouts/default', data);
};

const aboutUsPage = async (req,res) =>{
    let data = {
        message: flash.flashHandler(req),
        title: 'About GES',
        content: await loadView('pages/about')
    };
    res.render('layouts/default', data);
};


const institutionPage = async (req,res) =>{
    let data = {
        message: flash.flashHandler(req),
        title: 'GES Partners | Home',
        content: await loadView('pages/home')
    };
    res.render('layouts/default', data);
};

module.exports = { partnerHome,aboutUsPage,institutionPage };