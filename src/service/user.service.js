const User = require('../model/user.model');

class UserService {
    async createUser(user_name, password) {
        // todo 写入数据库
        // User.create({
        //     user_name,
        //     password
        // })
        const res = await User.create({ user_name, password });
        // console.log(res);
        return res;
    }
}

module.exports = new UserService();