/***********************************************
 * @author: James Abiagam (fabiagam@gmail.com)
 * @property: Glory Education.
 * @file: /routes/index.js
 * @name : Routes
 ************************************************/
"use strict";

const express = require('express');
const  router = express.Router();
const  webapp = require('../controllers/home');
const account = require('../controllers/partners');
const ssid = require('../middleware/sessionManager');

const formidable = require('../middleware/middleware');

router.get("/",webapp.partnerHome);
router.get("/about-us",webapp.aboutUsPage);
router.get("/institutions",webapp.institutionPage);
router.get("/request-otp/:email/:firstname",account.resendOTP);
router.get('/request-token/:email/:firstname',account.resendVerificationCode);

// Authenticated routes
router.get("/register",account.registration);
router.get("/login",account.login);
router.post("/authentication",formidable(),account.auth);
router.get("/verification",account.verifyOTP);
router.post("/verify-account", formidable(),account.sendOTPVerification);
router.get("/verify",account.verify);
router.post("/validate-account",formidable(),account.validateAccount);
router.post("/validate-otp",formidable(),account.validateOTP);
router.get("/dashboard",account.dashboard);
router.get("/profile",account.profile);
router.post("/update-profile",formidable(),account.updateUserProfile);
router.post("/change-password",formidable(),account.changePassword);
router.post("/send-invitation",formidable(),account.sendUserInvitation);
router.get("/update-passsword/:email",account.updatePassword);
router.post("/save-password",formidable(),account.savePassword);

router.get("/applications",account.applications);
router.get("/admissions",account.admissions);
router.get("/courses",account.manageCourses);
router.get("/candidates",account.candidates);

router.get("/secure",account.generate);
router.get("/logout",account.logout);

module.exports = router;