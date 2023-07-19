const { DataTypes } = require('sequelize');
const sequelize = require('../db/seq');

// 表名会变成复数:koa_user=>koa_users
const User = sequelize.define('koa_user', {
    // 在这里定义模型属性
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "用户名,唯一"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "密码"
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: "是否为管理员,0:不是管理员(默认);1:管理员"
    }
}, {
    // 这是其他模型参数
    timestamps: true
});

// `sequelize.define` 会返回模型
// console.log(User === sequelize.models.User); // true
// force强制重新创建,创建好后注释掉
// User.sync({ force: true })

module.exports = User