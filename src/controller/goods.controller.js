const path = require('path');

const {
    fileUploadError,
    unSupportedFileType
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
}

module.exports = new GoodsController();