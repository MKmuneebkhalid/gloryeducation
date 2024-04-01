/***********************************************
 * @author: James Abiagam (jabiagam@ounje360.com)
 * @property: Ounje360 Inc.
 * @file: middleware/sessionManager.js
 * @name : Middle Library
 ************************************************/
"use strict";

const helper = require("../helpers/helper");
const isLoggedIn = async (req, res, next) =>{
    let session = req.session;
    if(!session.ges_user){
        req.flash('message',helper.setFlash('You session has timed out. Please login to continue.','info','swal'));
        res.redirect('/login');
    }else{
        next();
    }
};


module.exports = { isLoggedIn };