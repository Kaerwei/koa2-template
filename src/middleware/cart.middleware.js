const { invalidGoodsID } = require('../constant/error.type');

// {
// goods_id: { type: 'number', required: true },
// }
const validator = (rules) => {
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules)
        } catch (err) {
            console.error(err);
            invalidGoodsID.result = err;
            return ctx.app.emit('error', invalidGoodsID, ctx);
        }

        await next();
    }
}

module.exports = {
    validator
}