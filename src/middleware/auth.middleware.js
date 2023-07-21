const jwt = require('jsonwebtoken');

const { TokenExpiredError, invalidToken } = require('../constant/error.type');

const { JWT_SECRET } = require('../config/config.default');

const auth = async (ctx, next) => {
    const { authorization } = ctx.request.header;
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

module.exports = {
    auth
}