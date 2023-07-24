// 1.导入sequelize的连接
const { DataTypes } = require('sequelize');
const sequelize = require('../db/seq');

// 2.定义Cart模型
const Carts = sequelize.define('koa_carts', {
    goods_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "商品的id"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户ID'
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '商品的数量'
    },
    selected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否选中'
    }
}, {
    timestamps: true,
});

// 3.同步数据(建表)
// Carts.sync({ force: true });
const Goods = require('./goods.model');
Carts.belongsTo(Goods, {
    foreignKey: 'goods_id'
});
// 4.导出Cart模型
module.exports = Carts;