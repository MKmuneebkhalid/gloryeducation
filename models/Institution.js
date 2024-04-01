/***************************************
 * Partner Model
 * @file: /models/Institution.js
 * @author: Glory Education.
 ****************************************/
"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const _uni = sequelize.define(
        "Institution",
        {
           /* id: {
                type: Sequelize.INTEGER,
                defaultValue: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },*/
            name: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING,
            },
            country_id: {
                type: Sequelize.BIGINT,
            },
            address_hq: {
                type: Sequelize.STRING,
            },
        },
        {
            sequelize, // We need to pass the connection instance
            timestamps: false,
            tableName: "ges_institutions",
        }
    );

    class Institution extends Model {
        static async add(payload) {
            return await _uni.create(payload);
        }

        static async getById(id) {
            return await _uni.findOne({  raw : true ,
                nest: true ,
                include: [{
                    all: true
                }],where: {id: id}});
        }

        static async getWhere(condition) {
            return await _uni.findOne({
                raw : true ,
                nest: true ,
                include: [{
                    all: true
                }],
                where: condition,
            });
        }

        static async getCount(condition) {
            return await _uni.count({
                raw : true ,
                nest: true ,
                include: [{
                    all: true
                }],
                where: condition,
            });
        }

        static async getByLimit(condition, offsetVal, limitVal) {
            return await _uni.findAll({
                where: condition,
                offset: offsetVal, limit: limitVal,
                order: [['id', 'DESC']]
            });
        }
        static async getAll() {
            return await _uni.findAll({
                order: [["name", "ASC"]],
            });
        }
        static async getByPartnerId(pid) {
            return await _uni.findAll({
                order: [["lastname", "ASC"],["firstname", "ASC"]], where: {partner_id: pid}
            });
        }
        static async updateById(id, update) {
            await _uni.update(update, {where: {id: id}});
        }
        static async updateByEmail(_email, update) {
            await _uni.update(update, {where: {email: _email}});
        }

        static async deleteById(id) {
            await _uni.destroy({where: {id: id}});
        }
    }

    return Institution;
};
