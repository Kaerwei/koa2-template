# 通用项目之Koa2通用项目

## 一、项目初始化

### 1 npm初始化

```javascript
npm init -y	
```

生成`package.json`文件：

- 记录项目依赖

### 2 git初始化

```git
git init
```

生成`.git`隐藏文件夹，是git的隐藏仓库

### 3 新建`.gitignore`文件

根目录新建，内容如下

```
node_modules
```

### 4 创建readme文件



## 二、搭建项目

### 1 安装Koa框架

koa中文文档：http://www.koajs.com.cn/#introduction

```
npm install koa
```

### 2 编写最基本的app

```javascript
const Koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
    ctx.body = 'HELLO WORLD'
})

app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000");
})
```

### 3 测试

终端使用`node src/main.js`

![image-20230718200528752](F:/typora-image/image-20230718200528752.png)



## 三、项目的基本优化

### 1 自动重启服务

安装nodemon工具

```
npm install nodemon
```

编写`package.json`

```javascript
  "scripts": {
    "dev": "nodemon src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

运行`npm run dev`启动服务

![image-20230718201538942](F:/typora-image/image-20230718201538942.png)

### 2 读取配置文件

安装`dotenv`，读取跟目中的`.env`文件，将配置写在`process.env`中

```javascript
npm i dotenv
```

创建`src/config/config.default.js`

```javascript
const dotenv = require('dotenv');
dotenv.config();

// console.log(process.env.APP_PORT);
module.exports = process.env;
```

### 3 改写`main.js`

```javascript
const Koa = require('koa');
// 导入config中的固定数据
const { APP_PORT } = require('./config/config.default');

const app = new Koa();

app.use((ctx, next) => {
    ctx.body = 'HELLO WORLD'
})

app.listen(APP_PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${APP_PORT}`);
})
```



## 四、添加路由

路由：根据不同的URL，调用对应处理函数

### 1 安装koa-router

git地址：https://github.com/ZijianHe/koa-router

```
npm i koa-router
```

步骤：

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件



### 2 编写路由

创建`src/router`目录，编写`user.route.js`

```js
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

// GET /users/
router.get('/', (ctx, next) => {
    ctx.body = 'hello world';
})

module.exports = router;
```

### 3 改写main.js

```js
const Koa = require('koa');
// 导入config中的固定数据
const { APP_PORT } = require('./config/config.default');
const userRouter = require('./router/user.route');
const app = new Koa();

app.use(userRouter.routes());

app.listen(APP_PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${APP_PORT}`);
})
```



## 五、目录结构优化

### 1 将http服务和app业务拆分

创建`src/app/index.js`文件

```js
const Koa = require('koa');

const userRouter = require('../router/user.route');
const app = new Koa();

app.use(userRouter.routes());

module.exports = app;
```

改写`main.js`

```js
const { APP_PORT } = require('./config/config.default');
const app = require('./app');

app.listen(APP_PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${APP_PORT}`);
})
```

### 2 将路由和控制器拆分

路由：解析URL，分发给控制器对应的方法

控制器：处理不同的业务

改写`user.route.js`

```js
const Router = require('koa-router');
const { register, login } = require('../controller/user.controller');
const router = new Router({ prefix: '/users' });

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);

module.exports = router;
```

创建`src/controller/user.controller.js`文件

```js
class UserController {
    async register(ctx, next) {
        ctx.body = "用户注册";
    }

    async login(ctx, next) {
        ctx.body = "登录成功";
    }
}

module.exports = new UserController();
```

