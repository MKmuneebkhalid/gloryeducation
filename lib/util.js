/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /lib/util.js
 * @name : Util Library
 ************************************************/
"use strict";


require("dotenv").config();
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const randomstring = require("randomstring");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const { sendEmail } = require("./mailjet");
const Constants = require("../constants/constants");


const formatMobileNumber = (mobile) => {
    let standardNumber = mobile.slice(1);
    return `${standardNumber}`;
};

const generateReferralCode = () => {
    return randomstring
        .generate({ length: 8, charset: "alphanumeric" })
        .toUpperCase();
};

const generateVerificationCode = () => {
    return randomstring
        .generate({ length: 6, charset: "numeric" });
};

const hashPassword = (password) => {
    let salt = 10;
    return bcrypt.hashSync(password, salt);
};

const verifyPassword = (inputPassword, hashedPassword) => {
    if (bcrypt.compareSync(inputPassword, hashedPassword)) {
        // Passwords match
        return true;
    } else {
        // Passwords didn't match
        return false;
    }
};

const AESEncrypt = (text, secret) => {
    return CryptoJS.AES.encrypt(text, secret).toString();
};

const AESDecrypt = (text, secret) => {
    let bytes = CryptoJS.AES.decrypt(text, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const parseToHtml = (htmlFilename, data) => {
    const compiled = ejs.compile(
        fs.readFileSync(
            path.resolve(__dirname, `../views/email/${htmlFilename}.ejs`),
            "utf8"
        )
    );
    const html = compiled(data);
    return html;
};

const loadView =  (ejsFilePath, data) => {
    try {
        const compiled =  ejs.compile(
            fs.readFileSync(
                path.resolve(__dirname, `../views/${ejsFilePath}.ejs`),
                "utf8"
            ), {async: true}
        );
        // const html = data ? compiled(data): compiled();
        const html =  compiled(data);
        return html;
    }catch(err){
        console.log(err);
    }
};



const maskEmailAddress = (str) => {
    str = str.split("");
    let finalArr = [];
    let len = str.indexOf("@");
    str.forEach((item, pos) => {
        pos >= 1 && pos <= len - 2 ? finalArr.push("*") : finalArr.push(str[pos]);
    });
    return finalArr.join("");
};

const sendEmailOneTimePasscode = async ({ firstname, email, otp, BASE_URL }) => {
    const maskedEmail = maskEmailAddress(email);
    const emailData = { firstname, email, otp, maskedEmail, baseUrl: BASE_URL };
    const subject = Constants.GES.OTP_EMAIL_SUBJECT;
    const from = Constants.GES.EMAIL_SENDER;
    const to = email;
    const htmlMessage = parseToHtml("otp_verification_html_email", emailData);
    const result = await sendEmail(from, to, subject, htmlMessage);
    if(result){
         return { success:true };
     }
     if(!result){
         return { success: false };
     }
};

const sendEmailInvitation = async ({ firstname, fullname, university,  email, defaultPassword, BASE_URL }) => {

    const emailData = { firstname, email, fullname, university, defaultPassword, baseUrl: BASE_URL };
    const subject = `New User Invitation - ${university}`;
    const from = Constants.GES.EMAIL_SENDER;
    const to = email;
    const htmlMessage = parseToHtml("new_user_html_email", emailData);
    const result = await sendEmail(from, to, subject, htmlMessage);
    if(result){
        return { success:true };
    }
    if(!result){
        return { success: false };
    }
};


module.exports = {
    generateReferralCode,
    formatMobileNumber,
    generateVerificationCode,
    sendEmailOneTimePasscode,
    loadView,
    hashPassword,
    verifyPassword,
    sendEmailInvitation
};