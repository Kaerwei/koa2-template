const jwt = require('jsonwebtoken');

const {
    TokenExpiredError,
    invalidToken,
    hasNotAdminPermission
} = require('../constant/error.type');

const { JWT_SECRET } = require('../config/config.default');

const auth = async (ctx, next) => {
    const { authorization = "" } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');

    try {
        const user = jwt.verify(token, JWT_SECRET);
        ctx.state.user = user;
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token已过期', err);
                return ctx.app.emit('error', TokenExpiredError, ctx);
            case 'JsonWebTokenError':
                console.error('token无效', err);
                return ctx.app.emit('error', invalidToken, ctx);
        }
    }

    await next();
}

const hadAdminPermission = async (ctx, next) => {
    const { is_admin } = ctx.state.user;

    if (!is_admin) {
        console.error('该用户没有管理员的权限', ctx.state.user);
        return ctx.app.emit('error', hasNotAdminPermission, ctx);
    }

    await next();
}

module.exports = {
    auth,
    hadAdminPermission
}