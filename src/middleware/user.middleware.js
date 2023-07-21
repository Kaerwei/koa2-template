const bcrypt = require('bcryptjs');

const { getUserInfo } = require('../service/user.service');
const { userFormatError, userAlreadyExited, userRegisterError, userDoesNotExist, invalidPassword, userLoginError } = require('../constant/error.type');

const userValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body;
    // 合法性
    if (!user_name || !password) {
        console.error('用户名或密码为空', ctx.request.body);
        ctx.app.emit('error', userFormatError, ctx)
        // ctx.status = 400;
        // ctx.body = {
        //     code: '10001',
        //     message: '用户名或密码为空',
        //     result: ''
        // };
        return;
    }
    await next();
}

const verifyUser = async (ctx, next) => {
    const { user_name, password } = ctx.request.body;
    // 合理性
    // if (await getUserInfo({ user_name })) {
    //     ctx.app.emit('error', userAlreadyExited, ctx);
    //     return
    // }
    try {
        const res = await getUserInfo({ user_name });
        if (res) {
            console.error('用户名已经存在', { user_name });
            ctx.app.emit('error', userAlreadyExited, ctx);
            return;
        }
    } catch (err) {
        console.error('获取用户信息错误', err);
        ctx.app.emit('error', userRegisterError, ctx);
        return;
    }
    await next();
}

const crpytPassword = async (ctx, next) => {
    const { password } = ctx.request.body;
    const salt = bcrypt.genSaltSync(10);
    // hash保存的是密文
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash;

    await next();
}

const verifyLogin = async (ctx, next) => {
    const { user_name, password } = ctx.request.body;
    try {
        // 1 判断用户是否存在（不存在：报错）
        const res = await getUserInfo({ user_name });

        if (!res) {
            console.error('用户名不存在', { user_name });
            ctx.app.emit('error', userDoesNotExist, ctx);
            return;
        }

        // 2 密码是否匹配（不匹配：报错）
        if (!bcrypt.compareSync(password, res.password)) {
            ctx.app.emit('error', invalidPassword, ctx);
            return
        }
    } catch (err) {
        console.error(err);
        return ctx.app.emit('error', userLoginError, ctx);
    }
    await next()
}

module.exports = {
    userValidator,
    verifyUser,
    crpytPassword,
    verifyLogin
}