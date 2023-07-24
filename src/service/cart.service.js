const { Op } = require('sequelize');
const Carts = require('../model/cart.model');
const Goods = require('../model/goods.model');

class CartService {
    async createOrUpdate(user_id, goods_id) {
        // 根据user_id和goods_id同时查找,有没有记录
        let res = await Carts.findOne({
            where: {
                [Op.and]: {
                    user_id, goods_id
                }
            }
        });
        if (res) {
            // 已经存在一条记录
            await res.increment('number');
            return await res.reload()
        } else {
            return await Carts.create({
                user_id,
                goods_id
            })
        }
    }
    async findCarts(pageNum, pageSize) {
        const offset = (pageNum - 1) * pageSize;
        const { count, rows } = await Carts.findAndCountAll({
            attributes: ['id', 'number', 'selected'],
            offset: offset,
            limit: pageSize * 1,
            include: {
                model: Goods,
                attributes: ['id', 'goods_name', 'goods_price', 'goods_img']
            },
        });

        return {
            pageNum,
            pageSize,
            total: count,
            list: rows
        }
    }

    async updateCarts(params) {
        const { id, number, selected } = params;
        const res = await Carts.findByPk(id);
        if (!res) return '';

        number !== undefined ? (res.number = number) : '';
        selected !== undefined ? (res.selected = selected) : '';

        return await res.save()
    }

    async removeCarts(ids) {
        return await Carts.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
    }

    async selectAllCarts(user_id) {
        return await Carts.update({ selected: true }, {
            where: {
                user_id
            }
        })
    }

    async unselectAllCarts(user_id) {
        return await Carts.update({ selected: false }, {
            where: {
                user_id
            }
        })
    }
}

module.exports = new CartService();