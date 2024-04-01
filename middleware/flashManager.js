/***********************************************
 * @author: James Abiagam (jabiagam@ounje360.com)
 * @property: Ounje360 Inc.
 * @file: middleware/flashManager.js
 * @name : Helper Library
 ************************************************/
"use strict";


const flashHandlerOld = async (req, res, next) => {
    try {
        let v = req.flash('message');
        console.log('Flash message -', v);
        if (req.flash('message').length > 0) {
            let messageStore = JSON.parse(req.flash('message')[0]);
            console.log('Real Flash message - ',messageStore);
            let {message, type, group} = messageStore;
            if (group === 'swal') {
                res.locals.message = message;
                res.locals.type = type;
                res.locals.group = group;
            } else if (group === 'flash') {
                res.locals.message = message;
                res.locals.type = type;
                res.locals.group = group;
            }
            req.flash('message')[0] = ''; // Reset flash message
        }
        next();
    }catch(err){
        console.log('Flash message Error -', err);
    }
};

const flashHandler =  (req) => {

    let flashObject = req.flash('message')[0];
    console.log('Flash message -', flashObject);
    let locals = undefined;
    //if (req.flash('message').length > 0) {
    if(flashObject !== undefined){
        let messageStore = JSON.parse(flashObject);
        console.log('Real Flash message - ', messageStore);
        let {message, type, group} = messageStore;
        if (group === 'swal') {
            locals = { message, type, group };
        } else if (group === 'flash') {
            locals = { message, type, group };
        }
        req.flash('message')[0] = ''; // Reset flash message
    }
    return locals;
};

module.exports = { flashHandler };