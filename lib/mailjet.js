/***************************************
 * Email Utility
 * @file: util/mailjet.js
 * @author: Glory Education
 ****************************************/
"use strict";
const path = require("path");
require("dotenv").config();
const Constants = require("../constants/constants");
const { GES } = Constants;
const nodemailer = require('nodemailer');
const _mailjet = require("node-mailjet");
const mailjet = _mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC,process.env.MJ_APIKEY_PRIVATE);

/**
 *
 * @param from
 * @param to
 * @param subject
 * @param htmlMessage
 * @returns {Promise<unknown>}
 */
const sendEmail = async (from, to, subject, htmlMessage) => {

  return new Promise((resolve, reject) => {
    const mailOptions = {
      to, // Change to your recipient
      from, // Change to your verified sender
      subject,
      html: htmlMessage,
    };
    if(process.env.NODE_ENV !== 'production'){
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
    } else {

      const request = mailjet.post("send", {version: "v3.1"}).request({
        Messages: [
          {
            From: {
              Email: from,
              Name: GES.EMAIL_SENDER,
            },
            To: [
              {
                Email: to,
                Name: to,
              },
            ],
            Subject: subject,
            HTMLPart: htmlMessage,
          },
        ],
      });
      request
          .then((result) => {
            console.log('Mailjet response - ',JSON.stringify(result.body));
            //return resolve(result.body);
            return resolve(true);
          })
          .catch((err) => {
            console.log(err.statusCode);
            console.info(err);
           // return reject(new Error(err));
            return resolve(false);
          });
    }
  });

};

module.exports = { sendEmail };
