const { createUser } = require('../service/user.service');
const { userRegisterError } = require('../constant/error.type');

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

        ctx.body = "登录成功," + user_name;
    }
}

module.exports = new UserController();