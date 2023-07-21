const jwt = require('jsonwebtoken');

const { createUser, getUserInfo } = require('../service/user.service');
const { userRegisterError } = require('../constant/error.type');

const { JWT_SECRET } = require('../config/config.default');

class UserController {
    async register(ctx, next) {
        // 1.获取数据
        const { user_name, password } = ctx.request.body;
        try {
            // 2.操作数据库
            const res = await createUser(user_name, password);
            // 3.返回结果
            ctx.body = {
                code: 0,
                message: "用户注册成功",
                result: {
                    id: res.id,
                    user_name: res.user_name
                }
            };
        } catch (err) {
            ctx.app.emit('error', userRegisterError, ctx);
        }

    }

    async login(ctx, next) {
        const { user_name, password } = ctx.request.body;

        // 1. 获取用户信息(token的payload中,记录id,user_name,is_admin)
        try {
            // 从返回结果对象中剔除password属性,将剩下的属性放到新的对象中
            const { password, ...res } = await getUserInfo({ user_name });
            ctx.body = {
                code: 0,
                message: '用户登录成功!',
                result: {
                    token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
                }
            }
        } catch (error) {
            console.error('用户登录失败' + error);

        }

    }

}

module.exports = new UserController();