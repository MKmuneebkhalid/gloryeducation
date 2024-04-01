/***********************************************
 * @author: James Abiagam (jabiagam@ounje360.com)
 * @property: Ounje360 Inc.
 * @file: /lib/date.js
 * @name : Date Util
 ************************************************/
"use strict";
const moment = require("moment-timezone");

class DateHelper {
  constructor() {
    this.tenMinutes = 600000; // 10 mins in milliseconds
  }

  setDate(timestamp) {
    return moment
      .unix(timestamp / 1000)
      .tz("Africa/Lagos")
      .format("DD MMM YYYY hh:mm a");
  }

  static tenMinutesTime(currenTimestamp) {
    return moment(currenTimestamp)
      .add(this.tenMinutes, "milliseconds")
      .toDate();
  }

  static nextMinutes(minutesToAdd) {
    //return moment(currenTimestamp).add(minutes, "m").toDate();
    let currentDate = new Date();
    let futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    return futureDate.valueOf();
  }

  static TwoMonthsTime() {
    let _2months = 5259600000; // 2 months in milliseconds
    return moment(DateHelper.getCurrentTimestamp()).add(
      _2months,
      "milliseconds"
    );
  }

  static daysTime(number) {
    let timestamp = this.getCurrentTimestamp();
    return moment(timestamp).add(number, "days");
  }

  static setCoreDate(timestamp) {
    return moment
      .unix(timestamp / 1000)
      .tz("Africa/Lagos")
      .format("DD MMM YYYY hh:mm a");
  }

  static getCurrentTimestamp() {
    return moment().valueOf();
  }

  static getCurrentDate() {
    let timestamp = moment().valueOf();
    return moment
      .unix(timestamp / 1000)
      .tz("Africa/Lagos")
      .format("DD MMM YYYY hh:mm a");
  }

  static durationHours(start, end) {
    let res = end.diff(start, "hours", true);
    res = res.toFixed(1);
    let rate = Number(Math.ceil(res));
    let period = end.diff(start, "minutes", true);
    // Generate Exit Timestamps
    let departTimestamp = Number(end);
    let departDate = this.setCoreDate(end);
    let ret = {
      duration: res,
      rate: Number(rate),
      _duration: this.timeConvert(period),
      _rate: rate + " hour(s)",
      exit_time: departDate,
      exit_timestamp: departTimestamp,
    };
    return ret;
  }

  static getTimeframe() {
    const tt = 4800000; // 80 mins in milliseconds
    const now = moment().valueOf();
    return moment(now).add(tt, "milliseconds");
  }

  static timeConvert(num) {
    let hours = Math.floor(num / 60);
    let minutes = num % 60;
    minutes = minutes.toFixed(0);
    return `${hours} hour(s) ${minutes} minutes`;
  }
}

module.exports = DateHelper;