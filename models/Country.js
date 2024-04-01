/***************************************
 * Partner Model
 * @file: /models/Country.js
 * @author: Glory Education.
 ****************************************/
"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const _uni = sequelize.define(
        "Country",
        {
           /* id: {
                type: Sequelize.INTEGER,
                defaultValue: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },*/
            country: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING,
            },
        },
        {
            sequelize, // We need to pass the connection instance
            timestamps: false,
            tableName: "ges_countries",
        }
    );

    class Country extends Model {
        static async add(payload) {
            return await _uni.create(payload);
        }

        static async getById(id) {
            return await _uni.findOne({
                raw: true,
                nest: true,
                include: [{
                    all: true
                }], where: {id: id}
            });
        }

        static async getAll() {
            return await _uni.findAll({
                order: [["country", "ASC"]],
            });
        }

        static async getWhere(condition) {
            return await _uni.findOne({
                raw: true,
                nest: true,
                include: [{
                    all: true
                }],
                where: condition,
            });
        }

        static async getCount(condition) {
            return await _uni.count({
                raw: true,
                nest: true,
                include: [{
                    all: true
                }],
                where: condition,
            });
        }

    }


return Country;
};
