/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /controllers/partners.js
 * @name : Partner Countroller
 ************************************************/
"use strict";

const flash = require('../middleware/flashManager');
const { loadView } = require('../lib/util');
const helper = require('../helpers/helper');
const model = require('../models/');
const util = require('../lib/util');
const date = require('../lib/date');
const sentry = require('../lib/debugger');


const getResources = async () =>{
    let dataList = [];
    let country = await model.Country.getAll();
    let school = await model.Institution.getAll();
    country.map((c)=>{
        let row = school.filter((s)=> c.id === s.country_id);
        let entry = {
            country: c.country,
            schools: row
        }
        dataList.push(entry);
    });
    return dataList;
};
const registration = async (req,res) =>{
    let list = await getResources();
    sentry.logger('drop down list - ', list, 'info');
    let data = {
        message: flash.flashHandler(req),
        title: 'Create GES Partner Account',
        content: await loadView('pages/register', {list })
    };
    res.render('layouts/default', data);
};

const login = async (req,res) =>{
    let data = {
        message: flash.flashHandler(req),
        title: 'GES Partner Login',
        content: await loadView('account/login')
    };
    res.render('layouts/admin_login', data);
};

const auth = async (req,res) =>{
    try{
            let redirectUrl = '';
          sentry.logger('Form login data - ', req.fields, 'info');
            let {email, password } = req.fields;
            if(!email && !password){
                req.flash('message',helper.setFlash('Please enter your email and password to continue.','error','swal'));
                redirectUrl = 'login';
            }
            if(email){
                  let _check =  await model.Partner.getWhere({email});
                  sentry.logger('auth check - ', _check, 'info');
                   if(!_check){
                      req.flash('message',helper.setFlash('Oops! incorrect login credentials. Please try again.','error','swal'));
                      redirectUrl = 'login';
                  }
                  if(_check) {
                      let check = _check;
                      sentry.logger('profile  data - ', check, 'info');
                      let {status, firstname} = check;
                      /*if(status !== 'active'){
                          // send email otp
                          req.flash('message',helper.setFlash(`Sorry! It seems your email address has not been verified. A verification code has been sent to ${email}. Please use it to verify your account and then login again.`,'error','swal'));
                          redirectUrl = 'verify';
                      }*/
                   if (password === process.env.DEFAULT_PASSWORD) {
                       redirectUrl = `update-password/${email}`;

                      } else {
                          if (util.verifyPassword(password, check.password)) { // Authenticated
                              let otp = util.generateVerificationCode();
                              sentry.logger('OTP data - ', otp, 'info');
                              let params = {
                                  firstname,
                                  email,
                                  otp,
                                  BASE_URL: `${process.env.PLATFORM_URL}/verification`
                              };
                              sentry.logger('params data - ', params, 'info');
                              let sendResponse = await util.sendEmailOneTimePasscode(params); // Send OTP
                              sentry.logger('Email response status - ', sendResponse, 'info');
                              if (!sendResponse.success) {
                                  req.flash('message', helper.setFlash(`Sorry! a problem occurred while sending the verification code for your account login. Please check that your email address is correctly spelt and try again.`, 'error', 'swal'));
                                  redirectUrl = 'login';
                              }
                              if (sendResponse.success) {
                                  let nextFifteenMins = date.nextMinutes(15);
                                  let updated = {otp, otp_lifetime: Number(nextFifteenMins)};
                                  sentry.logger('Update details - ', updated, 'info');
                                  await model.Partner.updateByEmail(email, updated); // update db with token
                                  //req.flash('message',helper.setFlash(`Welcome ${check.firstname}. You are now logged into your account`,'success','swal'));
                                  req.session.tokenRecipient = email;
                                  req.session.recipient = firstname;
                                  redirectUrl = 'verification';
                              }
                          } else {
                              req.flash('message', helper.setFlash(`Oops! incorrect login credentials. Please try again.`, 'error', 'swal'));
                              redirectUrl = 'login';
                          }
                   }
                  }
            }
            console.log('url path - ',redirectUrl);
            res.redirect(`/${redirectUrl}`);
    }catch(e) {
            sentry.logger('Error 500 ', e,'error');
            sentry.logger('500 url path - ',redirectUrl, 'error');
            let b = redirectUrl.split('http://');
           let t = b[1].split('/');
              res.redirect(`/${t[1]}`);
    }
};

const verifyOTP = async (req,res) =>{
    let _email = req.session.tokenRecipient;
    let firstname = req.session.recipient;
    if(!_email){
        res.redirect('/');
    }else {
        let data = {
            message: flash.flashHandler(req),
            title: 'One Time Code Verification',
            content: await loadView('account/validate_otp', {email: _email,firstname})
        };
        res.render('layouts/admin_login', data);
    }
};

const validateOTP =  async (req,res) =>{
    try{
        let redirectUrl = '';
        sentry.logger('OTP data - ', req.fields, 'info');
        let {token,recipient } = req.fields;
        let currentTimestamp = date.getCurrentTimestamp();
        let condition = { email:recipient, otp: token};
        let lookup = await model.Partner.getWhere(condition);
        if(!lookup){ // invalid/incorrect otp entered
            req.flash('message',helper.setFlash(`Oops! you entered an incorrect verification code. Please try again.`,'error','swal'));
            redirectUrl = 'verification';
        }
        if(lookup){
            let { otp,otp_lifetime, id, partner_id, role, last_login,  title, firstname, lastname, date_timestamp, address1, address2, province, country } = lookup;
            if((token === otp) && (Number(currentTimestamp) > Number(otp_lifetime))){ // expired otp
                req.flash('message',helper.setFlash(`Sorry! this verification code is now expired. Please request for a new passcode.`,'error','swal'));
                redirectUrl = 'verification';
            }
            if((token === otp) && (Number(currentTimestamp) <= Number(otp_lifetime))){ // success
                // set session
                req.session.ges_user = recipient;
                req.session.firstname = firstname;
                req.session.lastname = lastname;
                req.session.partnerId = partner_id;
                req.session.user_id = id;
                req.session.last_login = Number(last_login);
                req.session.profile = {
                   organisation: title,
                    role,
                   date_timestamp: Number(date_timestamp),
                    address1,
                    address2,
                    province,
                    country,
                };
                // Update last login
                let nextTimestamp =  date.getCurrentTimestamp();
                let updated = { last_login : nextTimestamp};
                await model.Partner.updateById(id,updated);
                req.flash('message',helper.setFlash(`You are now logged into your account!`,'success','swal'));
                redirectUrl = 'dashboard';
                // delete recipient
                delete req.session.tokenRecipient;
                delete req.session.recipient;
            }
        }
        res.redirect(`/${redirectUrl}`);
    }catch(e) {
        console.log('Error 500 ', e);
    }
};

const resendOTP = async (req,res) =>{
    let { email , firstname } = req.params;
    let otp = util.generateVerificationCode();
    sentry.logger('New OTP data - ', otp, 'info');
    let params = {
        firstname,
        email,
        otp,
        BASE_URL: `${process.env.PLATFORM_URL}/verification`
    };
    console.log('params data - ', params);
    let sendResponse =  await util.sendEmailOneTimePasscode(params); // Send OTP
    console.log('Email response status - ', sendResponse);
    let nextFifteenMins = date.nextMinutes(15);
    let updated = {otp, otp_lifetime: Number(nextFifteenMins)};
    sentry.logger('Update details - ', updated, 'info');
    await model.Partner.updateByEmail(email, updated);
    res.redirect(`/verification`);
};

const resendVerificationCode = async (req,res) =>{
    let { email , firstname } = req.params;
    let otp = util.generateVerificationCode();
    sentry.logger('New OTP data - ', otp, 'info');
    let params = {
        firstname,
        email,
        otp,
        BASE_URL: `${process.env.PLATFORM_URL}/verify`
    };
    console.log('params data - ', params);
    let sendResponse =  await util.sendEmailOneTimePasscode(params); // Send OTP
    console.log('Email response status - ', sendResponse);
    let nextFifteenMins = date.nextMinutes(15);
    let updated = {otp, otp_lifetime: Number(nextFifteenMins)};
    sentry.logger('Update details - ', updated, 'info');
    await model.Partner.updateByEmail(email, updated);
    res.redirect(`/verify`);
};

const setPartnerProfile = (_role, payload) =>{
    let profileSchema = {};
    let { firstname, lastname, email, institution, password, address1, address2, province, country, postcode, token } = payload;
    let uniqueId = `PA${util.generateVerificationCode()}`;
    let newTime = date.getCurrentTimestamp();
    let expiryTime = date.nextMinutes(15);
    let c = institution.split('|');
    let cCode = c[0];
    let university = c[1];
    profileSchema = {
        partner_id: uniqueId,
        firstname,
        lastname,
        title: university,
        role: _role,
        email,
        password: util.hashPassword(password),
        status: 'pending',
        otp: token,
        otp_lifetime: Number(expiryTime),
        date_added: date.setCoreDate(newTime),
        date_timestamp: Number(newTime),
        address1,
        address2,
        postcode,
        province,
        country,
    };
    return profileSchema;
};
const sendOTPVerification = async (req,res) =>{
    try{
        let redirectUrl = '';
        sentry.logger('Form login data - ', req.fields, 'info');
        let {email, password, institution, firstname, lastname, address1, address2, postcode, province, country } = req.fields;
        if(!email && !password && !institution && !firstname && !lastname && !address1 && !province && !postcode && !country){
            req.flash('message',helper.setFlash('Oops! it seems the form is not completed. Please review and try again.','error','swal'));
            redirectUrl = 'register';
        }else {
            let cc = institution.split('|');
            let _check = await model.Partner.getWhere({email});
            sentry.logger('Registration check - ', _check, 'info');
            if (_check) {
                req.flash('message', helper.setFlash(`Oops! An account registered with ${email} under ${cc[1]} already exists. Please try again with a different mail address.`, 'error', 'swal'));
                redirectUrl = 'register';
            }
            if (!_check) {
                let otp = util.generateVerificationCode();
                req.fields.token = otp;
                  let schema =  setPartnerProfile('admin',req.fields);
                  let { partner_id } = schema;
                  let cCode = cc[0];
                  let codeSchema = { code: cCode, partner_id};
                  let odata = await model.Partner.add(schema);
                  let codeData = await model.PartnerCode.add(codeSchema);
                  // Send OTP

                sentry.logger('OTP data - ', otp,'info');
                let params = {
                    firstname,
                    email,
                    otp,
                    BASE_URL: `${process.env.PLATFORM_URL}/verify`
                };
                sentry.logger('params data - ', params,'info');
                let sendResponse =  await util.sendEmailOneTimePasscode(params); // Send OTP
                sentry.logger('Email response status - ', sendResponse, 'info');
                if(!sendResponse.success){
                    req.flash('message',helper.setFlash(`Sorry! a problem occurred while sending the verification code to your mailbox. Please check that your email address is correctly spelt and try again.`,'error','swal'));
                    redirectUrl = 'register';
                }
                if(sendResponse.success) {
                    let nextFifteenMins = date.nextMinutes(15);
                    let updated = {otp, otp_lifetime: Number(nextFifteenMins)};
                    sentry.logger('Update details - ', updated, 'info');
                    await model.Partner.updateByEmail(email, updated); // update db with token
                    req.session.tokenRecipient = email;
                    req.session.recipient = firstname;
                    redirectUrl = 'verify';
                }
            }
        }
        res.redirect(`/${redirectUrl}`);
    }catch(e) {
        console.log('Error 500 ', e);
    }
};

const verify = async (req,res) =>{
    let _email = req.session.tokenRecipient;
    let firstname = req.session.recipient;
    if(!_email){
        res.redirect('/');
    }else {
        let data = {
            message: flash.flashHandler(req),
            title: 'GES Partner Login',
            content: await loadView('account/verify_otp', {email: _email,firstname})
        };
        res.render('layouts/admin_login', data);
    }
};

const validateAccount =  async (req,res) => {
    try {
        let redirectUrl = '';
        sentry.logger('OTP data - ', req.fields, 'info');
        let {token, recipient} = req.fields;
        let currentTimestamp = date.getCurrentTimestamp();
        let condition = {email: recipient, otp: token};
        let lookup = await model.Partner.getWhere(condition);
        if (!lookup) { // invalid/incorrect otp entered
            req.flash('message', helper.setFlash(`Oops! you entered an incorrect verification code. Please try again.`, 'error', 'swal'));
            redirectUrl = 'verify';
        }
        if (lookup) {
            let {
                otp,
                otp_lifetime,
                id,
                partner_id,
                role,
                last_login,
                title,
                firstname,
                lastname,
                date_timestamp,
                address1,
                address2,
                province,
                country
            } = lookup;
            if ((token === otp) && (Number(currentTimestamp) > Number(otp_lifetime))) { // expired otp
                req.flash('message', helper.setFlash(`Sorry! this verification code is now expired. Please request for a new passcode.`, 'error', 'swal'));
                redirectUrl = 'verify';
            }
            if ((token === otp) && (Number(currentTimestamp) <= Number(otp_lifetime))) { // success
                // set session
                req.session.ges_user = recipient;
                req.session.firstname = firstname;
                req.session.lastname = lastname;
                req.session.partnerId = partner_id;
                req.session.user_id = id;
                req.session.last_login = Number(last_login);
                req.session.profile = {
                    organisation: title,
                    role,
                    date_timestamp: Number(date_timestamp),
                    address1,
                    address2,
                    province,
                    country,
                };
                // Update last login
                let nextTimestamp = date.getCurrentTimestamp();
                let updated = {last_login: nextTimestamp, status:'active'};
                await model.Partner.updateById(id, updated);
                req.flash('message', helper.setFlash(`You are now logged into your account!`, 'success', 'swal'));
                redirectUrl = 'dashboard';
                // delete recipient
                delete req.session.tokenRecipient;
                delete req.session.recipient;
            }
        }
        res.redirect(`/${redirectUrl}`);
    } catch (e) {
        console.log('Error 500 ', e);
    }
};

const dashboard = async (req,res) =>{
    global.active = 'dashboard';
    let data = {
        message: flash.flashHandler(req),
        title: 'GES Partner Dashboard',
        content: await loadView('account/dashboard')
    };
    res.render('layouts/admin', data);
};

const profile = async (req,res) =>{
    global.active = 'profile';
    let data = {
        message: flash.flashHandler(req),
        title: 'Partner Profile',
        content: await loadView('account/profile')
    };
    res.render('layouts/admin', data);
};

const updateUserProfile = async (req,res) =>{
  try{
      let redirectUrl = '';
      sentry.logger('profile data - ', req.fields, 'info');
      let {firstname, lastname, address1, address2, province, postcode, email } = req.fields;
      // Update Session cookie
      req.session.ges_user = email;
      req.session.firstname = firstname;
      req.session.lastname = lastname;
      req.session.profile.address1 = address1;
      req.session.profile.address2 = address2;
      req.session.profile.province = (province)? `${postcode}, ${province}`: province;
      global.firstname = firstname;
      global.lastname = lastname;
      global.profile.address1 = address1;
      global.profile.address2 = address2;
      global.profile.province  = province;
      global.gesUser = email;
      // Update DB
      let updateSchema = {
         firstname,
         lastname,
         email,
         address1,
         address2,
         province
      };
     await model.Partner.updateById(req.session.user_id,updateSchema);
      req.flash('message', helper.setFlash(`Profile updated successfully!.`, 'success', 'swal'));
      redirectUrl = 'profile';
      res.redirect(`/${redirectUrl}`);
  } catch (e) {
      console.log('Error 500 ', e);
  }
};

const changePassword =  async (req,res) =>{
    try{
        let redirectUrl = '';
        sentry.logger('password change  data - ', req.fields, 'info');
        let {password, newpassword,renewpassword} = req.fields;
        // get profile
        let profile = await model.Partner.getWhere({email: req.session.gesUser});
        if(!util.verifyPassword(password,profile.password)){
            req.flash('message', helper.setFlash(`The current password is incorrect. Please try again.`, 'error', 'swal'));
            redirectUrl = 'profile';
        }else{
            if(newpassword !== renewpassword){
                req.flash('message', helper.setFlash(`The new password does not match. Please re-type again!.`, 'error', 'swal'));
                redirectUrl = 'profile';
            }else{
                let updated = {password: util.hashPassword(newpassword)};
                await model.Partner.updateById(req.session.user_id, updated);
                redirectUrl = 'profile';
            }
        }
        res.redirect(`/${redirectUrl}`);
    } catch (e) {
        console.log('Error 500 ', e);
    }
};

const sendUserInvitation = async (req,res) =>{
    try{
        let redirectUrl = '';
        sentry.logger('New user - ', req.fields, 'info');
        let {firstname, lastname, email} = req.fields;
        let partnerId = req.session.partnerId;
        let _password = process.env.DEFAULT_PASSWORD;
        let newTime = date.getCurrentTimestamp();
        let profileSchema = {
            partner_id: partnerId,
            firstname,
            lastname,
            title: req.session.profile.organisation,
            role: 'member',
            email,
            password: util.hashPassword(_password),
            status: 'pending',
            date_added: date.setCoreDate(newTime),
            date_timestamp: Number(newTime),
            country: req.session.profile.country
        }
        let odata = await model.Partner.add(profileSchema);
        sentry.logger('Profile created - ', odata, 'info');
        // send email
        let params = {
            firstname,
            fullname: `${req.session.firstname} ${req.session.lastname}`,
            email,
            defaultPassword: _password,
            university: `${req.session.profile.organisation}`,
            BASE_URL: `${process.env.PLATFORM_URL}/login`
        };
        console.log('params data - ', params);
        let sendResponse =  await util.sendEmailInvitation(params); // Send OTP
        console.log('Email response status - ', sendResponse);
        res.redirect(`/${redirectUrl}`);
    } catch (e) {
        console.log('Error 500 ', e);
    }
};

const updatePassword = async (req,res) =>{
   // global.active = 'profile';
    let { email } = req.params;
    let rec = await model.Partner.getWhere({email});
    let data = {
        message: flash.flashHandler(req),
        title: 'Change Password',
        content: await loadView('account/change_password',{rec})
    };
    res.render('layouts/admin_login', data);
};

const savePassword = async (req,res) => {
    try {
        let redirectUrl = '';
        sentry.logger('New user - ', req.fields, 'info');
        let {email, new_password, firstname } = req.fields;
        let updateData = {
            password: util.hashPassword(new_password),
            status:'active'
        };
        await model.Partner.updateByEmail(email,updateData);
        let otp = util.generateVerificationCode();
        sentry.logger('OTP data - ', otp, 'info');
        let params = {
            firstname,
            email,
            otp,
            BASE_URL: `${process.env.PLATFORM_URL}/verification`
        };
        sentry.logger('params data - ', params, 'info');
        let sendResponse = await util.sendEmailOneTimePasscode(params); // Send OTP
        sentry.logger('Email response status - ', sendResponse, 'info');
        if (!sendResponse.success) {
            req.flash('message', helper.setFlash(`Sorry! a problem occurred while sending the verification code for your account login. Please check that your email address is correctly spelt and try again.`, 'error', 'swal'));
            redirectUrl = 'login';
        }
        if (sendResponse.success) {
            let nextFifteenMins = date.nextMinutes(15);
            let updated = {otp, otp_lifetime: Number(nextFifteenMins)};
            sentry.logger('Update details - ', updated, 'info');
            await model.Partner.updateByEmail(email, updated); // update db with token
            //req.flash('message',helper.setFlash(`Welcome ${check.firstname}. You are now logged into your account`,'success','swal'));
            req.session.tokenRecipient = email;
            req.session.recipient = firstname;
            redirectUrl = 'verification';
        }
        res.redirect(`/${redirectUrl}`);
    } catch (e) {
        console.log('Error 500 ', e);
    }
};

const applications = async (req,res) =>{
    global.active = 'applications';
    let data = {
        message: flash.flashHandler(req),
        title: 'All Applications',
        content: await loadView('account/applications')
    };
    res.render('layouts/admin', data);
};


const admissions = async (req,res) =>{
    global.active = 'admissions';
    let data = {
        message: flash.flashHandler(req),
        title: 'Admissions',
        content: await loadView('account/admissions')
    };
    res.render('layouts/admin', data);
};

const manageCourses = async (req,res) =>{
    global.active = 'courses';
    let data = {
        message: flash.flashHandler(req),
        title: 'Manage Courses',
        content: await loadView('account/courses')
    };
    res.render('layouts/admin', data);
};

const candidates = async (req,res) =>{
    global.active = 'candidates';
    let data = {
        message: flash.flashHandler(req),
        title: 'Candidates',
        content: await loadView('account/candidates')
    };
    res.render('layouts/admin', data);
};




const generate = async (req,res) =>{
    let rawPassword = 'password';
    let encryptedPassword = util.hashPassword(rawPassword);
    return res.status(200).send({
        success: true,
        data: {password: encryptedPassword },
        message: "new password generated",
    });
};

const logout = async  (req,res) => {
    // req.session.destroy();
    req.flash('message', helper.setFlash('You are now logged out of your account.', 'info', 'swal'));
    res.clearCookie('connect.sid') // clean up!
    res.clearCookie('session');
    res.clearCookie('profile');
    res.clearCookie('ges_user');
    res.clearCookie('last_login');
    res.clearCookie('firstname');
    res.clearCookie('lastname');
    res.clearCookie('partnerId');
    res.clearCookie('user_id');
    res.header('cache-control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('/login');
};


module.exports = { registration, login, auth, verifyOTP, verify,validateOTP,dashboard,generate,resendOTP, logout,sendOTPVerification, validateAccount,
    resendVerificationCode, profile, updateUserProfile, changePassword, sendUserInvitation, updatePassword, savePassword,
    manageCourses, admissions, applications, candidates};