/***********************************************
 * @name: GES Database Connection
 * @author: Glory Education Services.
 * @file: models/index.js
 ***********************************************/
"use strict";

const dbo = require("../config/db");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbo.DATABASE, dbo.USER, dbo.PASSWORD, {
    host: dbo.HOST,
    dialect: 'mysql',
    port: dbo.PORT,
    pool: {
        max: dbo.pool.max,
        min: dbo.pool.min,
        acquire: dbo.pool.acquire,
        idle: dbo.pool.idle,
    },
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully on GES Database.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.News = require("./News")(sequelize, Sequelize);
db.Partner = require("./Partner")(sequelize, Sequelize);
db.Institution = require("./Institution")(sequelize, Sequelize);
db.Country = require("./Country")(sequelize, Sequelize);
db.PartnerCode = require("./PartnerCode")(sequelize, Sequelize);


module.exports = db;