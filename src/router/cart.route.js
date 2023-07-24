// 1.导入koa-router
const Router = require('koa-router');

const { add, findAll } = require('../controller/cart.controller');

const { auth } = require('../middleware/auth.middleware');
const { validator } = require('../middleware/cart.middleware');
// 2.实例化router对象
const router = new Router({ prefix: '/cart' });

// 3.编写路由规则:登录,格式
router.post('/', auth, validator, add);
router.get('/', auth, findAll);

// 4.导出router对象
module.exports = router;