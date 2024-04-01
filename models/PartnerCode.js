/***************************************
 * Partner Model
 * @file: /models/PartnerCode.js
 * @author: Glory Education.
 ****************************************/
"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const _uni = sequelize.define(
        "PartnerCode",
        {
          /*  id: {
                type: Sequelize.INTEGER,
                defaultValue: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },*/
            partner_id: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING,
            },
        },
        {
            sequelize, // We need to pass the connection instance
            timestamps: false,
            tableName: "partners_code",
        }
    );

    class PartnerCode extends Model {
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


    return PartnerCode;
};
