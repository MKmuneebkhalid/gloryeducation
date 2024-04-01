/***************************************
 * Partner Model
 * @file: /models/Partner.js
 * @author: Glory Education.
 ****************************************/
"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const _partner = sequelize.define(
        "Partner",
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
            firstname: {
                type: Sequelize.STRING,
            },
            lastname: {
                type: Sequelize.STRING,
            },
            title: {
                type: Sequelize.STRING,
            },
            role: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            otp: {
                type: Sequelize.STRING,
            },
            otp_lifetime: {
                type: Sequelize.BIGINT,
            },
            last_login: {
                type: Sequelize.BIGINT,
            },
            address1: {
                type: Sequelize.STRING,
            },
            address2: {
                type: Sequelize.STRING,
            },
            postcode: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            date_added: {
                type: Sequelize.STRING,
            },
            date_timestamp: {
                type: Sequelize.BIGINT,
            },
        },
        {
            sequelize, // We need to pass the connection instance
            timestamps: false,
            tableName: "partners",
        }
    );

    class Partner extends Model {
        static async add(payload) {
            return await _partner.create(payload);
        }

        static async getById(id) {
            return await _partner.findOne({  raw : true ,
                nest: true ,
                include: [{
                    all: true
                }],where: {id: id}});
        }

        static async getWhere(condition) {
            return await _partner.findOne({
                raw : true ,
                nest: true ,
                include: [{
                    all: true
                }],
                where: condition,
            });
        }

        static async getCount(condition) {
            return await _partner.count({
                where: condition,
            });
        }

        static async getByLimit(condition, offsetVal, limitVal) {
            return await _partner.findAll({
                where: condition,
                offset: offsetVal, limit: limitVal,
                order: [['id', 'DESC']]
            });
        }
        static async getAll() {
            return await _partner.findAll({
                order: [["name", "ASC"]],
            });
        }
        static async getByPartnerId(pid) {
            return await _partner.findAll({
                order: [["lastname", "ASC"],["firstname", "ASC"]], where: {partner_id: pid}
            });
        }
        static async updateById(id, update) {
            await _partner.update(update, {where: {id: id}});
        }
        static async updateByEmail(_email, update) {
            await _partner.update(update, {where: {email: _email}});
        }

        static async deleteById(id) {
            await _partner.destroy({where: {id: id}});
        }
    }

    return Partner;
};
