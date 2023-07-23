class CartService {
    async createOrUpdate(user_id, goods_id) {
        return {
            user_id,
            goods_id,
            number: 1,
            selected: true
        }
    }
}

module.exports = new CartService();