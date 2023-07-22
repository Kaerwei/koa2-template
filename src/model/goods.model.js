const { DataTypes } = require('sequelize');
const sequelize = require('../db/seq');

// 表名会变成复数:koa_user=>koa_users
const Goods = sequelize.define('koa_goods', {
    // 在这里定义模型属性
    goods_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "商品名称"
    },
    goods_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '商品价格'
    },
    goods_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '库存'
    },
    goods_img: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '商品图片的url'
    },

}, {
    timestamps: true,
    paranoid: true
});

// Goods.sync({ force: true });

module.exports = Goods;