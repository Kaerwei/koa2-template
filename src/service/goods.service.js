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

    async findGoods(pageNum, pageSize) {
        // 1.获取总数
        // const count = await Goods.count();
        // 2.获取分布的具体数据
        const offset = (pageNum - 1) * pageSize;
        // const rows = await Goods.findAll({ offset, limit: pageSize * 1 });

        const { count, rows } = await Goods.findAndCountAll({
            offset,
            limit: pageSize * 1
        });

        return {
            pageNum: pageNum * 1,
            pageSize: pageSize * 1,
            total: count,
            list: rows
        }
    }
}

module.exports = new GoodsService();