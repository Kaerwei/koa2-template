const path = require('path');

const { createGoods } = require('../service/goods.service');

const {
    fileUploadError,
    unSupportedFileType,
    publishGoodsError
} = require('../constant/error.type');

class GoodsController {
    async upload(ctx, next) {
        const { file } = ctx.request.files;
        const mimeTypes = ['image/jpeg', 'image/png'];
        if (file) {
            if (!mimeTypes.includes(file.mimetype)) {
                return ctx.app.emit('error', unSupportedFileType, ctx);
            }
            ctx.body = {
                code: 0,
                message: '图片上传成功!',
                result: {
                    goods_img: path.basename(file.filepath)
                }
            }

        } else {
            return ctx.app.emit('error', fileUploadError, ctx);
        }
    }

    async create(ctx) {
        // 直接调用service的createGoods的方法
        try {
            const { createdAt, updatedAt, ...res } = await createGoods(ctx.request.body);
            ctx.body = {
                code: 0,
                message: '发布商品成功!',
                result: res
            }
        } catch (err) {
            console.error(err);
            return ctx.app.emit('error', publishGoodsError, ctx);
        }
    }
}

module.exports = new GoodsController();