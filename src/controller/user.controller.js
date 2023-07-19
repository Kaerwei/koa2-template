class UserController {
    async register(ctx, next) {
        ctx.body = "用户注册";
    }

    async login(ctx, next) {
        ctx.body = "登录成功";
    }
}

module.exports = new UserController();