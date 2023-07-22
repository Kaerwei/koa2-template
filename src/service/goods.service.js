const Goods = require('../model/goods.model');

class GoodsService {
    async createGoods(goods) {
        const res = await Goods.create(goods);
        return res.dataValues;
    }

    async updateGoods(id, goods) {
        const res = await Goods.update(goods, { where: { id } });
        return res[0] > 0
    }

    async removeGoods(id) {
        const res = await Goods.destroy({ where: { id } })
        return res > 0
    }

    async restoreGoods(id) {
        const res = await Goods.restore({ where: { id } });
        return res > 0
    }
}

module.exports = new GoodsService();