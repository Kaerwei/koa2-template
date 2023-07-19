const Router = require('koa-router');
const { register, login } = require('../controller/user.controller');
const { createUser } = require('../service/user.service');
const router = new Router({ prefix: '/users' });

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);

module.exports = router;