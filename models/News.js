/***************************************
 * News Model
 * @file: /models/News.js
 * @author: Glory Education
 ****************************************/
"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const news = sequelize.define("News",
        {
          /*  id: {
                type: Sequelize.INTEGER,
                defaultValue: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },*/
            oid: {
                type: Sequelize.Sequelize.UUID,
            },
            title: {
                type: Sequelize.STRING,
            },
            slug: {
                type: Sequelize.STRING,
            },
            picture: {
                type: Sequelize.STRING,
            },
            body: {
                type: Sequelize.TEXT,
            },
            status: {
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
            // schema: "public",
            tableName: "ges_news",
        }
    );

    class News extends Model {
        static async add(payload) {
            return await news.create(payload);
        }

        static async getById(id) {
            return await news.findOne({ where: { oid: id } });
        }

        static async getByNewsId(pid) {
            return await news.findOne({
                where: { id: pid },
            });
        }

        static async getByPagination(condition,offsetVal,limitVal){
            return await news.findAndCountAll({
            where: condition,
            offset: offsetVal, limit: limitVal,
            order: [['date_timestamp', 'DESC']],
             });
        }

        static async getWhere(condition) {
            return await news.findOne({ where: condition });
        }

        static async getByLimit(condition,size) {
            return await news.findAll({
                where: condition,
                offset: 0, limit: size,
                order: [['date_timestamp', 'DESC']], });
        }


        static async getAll() {
            return await news.findAll({
                order: [["date_timestamp", "DESC"]],
            });
        }

        static async updateById(id, update) {
            await news.update(update, { where: { oid: id } });
        }

        static async updateByNewsId(pid, update) {
            await news.update(update, { where: { id: pid } });
        }

        static async deleteById(id) {
            await news.destroy({ where: { id: id } });
        }
    }

    return News;
};