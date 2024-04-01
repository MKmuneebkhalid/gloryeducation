/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /util/sendgrid.js
 * @name : Util Library
 ************************************************/
"use strict";

require("dotenv").config();
const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);




const sendEmail = async ({to,from,subject,message}) =>{

   return new Promise((reject,resolve) =>{
       const mailOptions = {
           to, // Change to your recipient
           from, // Change to your verified sender
           subject,
           html: message,
       };
       if(process.env.NODE_ENV === 'development'){
           let transporter = nodemailer.createTransport({
               host: process.env.MAILTRAP_SMTP_HOST,
               port: parseInt(process.env.MAILTRAP_SMTP_HOST),
               secure: false,
               auth: {
                   user: process.env.MAILTRAP_SMTP_USER,
                   pass: process.env.MAILTRAP_SMTP_PASS
               }
           });
           transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                   console.log("error is "+ error);
                   resolve(false); // or use rejcet(false) but then you will have to handle errors
               }
               else {
                   console.log('Email sent: ' + info.response);
                   resolve(true);
               }
           });
            /*transporter.sendMail(msg).then((response) => {
                //console.log('Mailtrap response - ',response);
                return resolve(response);
               })
                .catch((error) => {
                   // console.error('Mailtrap response - ',error);
                    return resolve(error);
                });*/
       }else {
           sgMail
               .send(msg)
               .then((response) => {
                  // console.log(response[0].statusCode);
                  // console.log(response[0].headers);
                   return resolve(response[0]);
               })
               .catch((error) => {
                   //console.error(error);
                   return resolve(error);
                   //return reject(error);
               });
       }
   });

};



module.exports = {sendEmail};