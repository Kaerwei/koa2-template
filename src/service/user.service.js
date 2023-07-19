const User = require('../model/user.model');

class UserService {
    async createUser(user_name, password) {
        // todo 写入数据库
        return '用户注册成功！';
    }
}

module.exports = new UserService();