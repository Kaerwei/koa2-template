# Koa2 商城项目

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
npm install nodemon -D
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

## 六、解析body

### 1 安装koa-body

git地址：https://github.com/koajs/koa-body

```js
npm i koa-body
```

### 2 注册中间件

改写`src/app/index.js`

```js
const Koa = require('koa');
const { koaBody } = require('koa-body');
const userRouter = require('../router/user.route');
const app = new Koa();

app.use(koaBody());
app.use(userRouter.routes());

module.exports = app;
```

### 3 解析请求数据

改写`user.controller.js`文件

```js
const { createUser } = require('../service/user.service');

class UserController {
    async register(ctx, next) {
        // 1.获取数据
        const { user_name, password } = ctx.request.body;
        // 2.操作数据库
        const res = await createUser(user_name, password);
        // 3.返回结果
        ctx.body = res;
    }

    async login(ctx, next) {
        ctx.body = "登录成功";
    }
}

module.exports = new UserController();
```

### 4 拆分service层

service层主要是做数据库处理的

创建`src/service/user.service.js`文件

```js
class UserService {
    async createUser(user_name, password) {
        // todo 写入数据库
        return '写入数据库成功!'
    }
}

module.exports = new UserService();
```

## 七、集成sequelize

Sequelize ORM数据库工具

ORM：对象关系映射

- 数据表映射（对应）一个对象
- 数据表中的数据库（记录）对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

中文文档：https://www.sequelize.cn/core-concepts/getting-started

### 1 安装sequelize

```js
npm i mysql2 sequelize
```

### 2 连接数据库

创建`src/db/seq.js`文件

```js
const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = require('../config/config.default');

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
});

// seq.authenticate().then(() => {
//     console.log("数据库连接成功!");
// }).catch(() => {
//     console.log("数据库连接失败!");
// })

module.exports = seq;
```

### 3 编写配置文件

```
APP_PORT=8000

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = Kaerwei110877552
MYSQL_DB = koa_ty
```

## 八、创建User模型

### 1 拆分model层

sequelize主要通过Model对应数据表

创建`src/model/user.model.js`

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/seq');

// 表名会变成复数:koa_user=>koa_users
const User = sequelize.define('koa_user', {
    // 在这里定义模型属性
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "用户名,唯一"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "密码"
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: "是否为管理员,0:不是管理员(默认);1:管理员"
    }
}, {
    // 这是其他模型参数
    timestamps: true
});

// `sequelize.define` 会返回模型
// console.log(User === sequelize.models.User); // true
// force强制重新创建,创建好后注释掉
User.sync({ force: true })
```

## 九、添加User新用户

模型（基础）文档：https://www.sequelize.cn/core-concepts/model-querying-basics

改写`src/service/user.service.js`

```js
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
```

同时改写`src/controller/user.controller.js`

```js
const { createUser } = require('../service/user.service');

class UserController {
    async register(ctx, next) {
        // 1.获取数据
        const { user_name, password } = ctx.request.body;
        // 2.操作数据库
        const res = await createUser(user_name, password);
        // 3.返回结果
        ctx.body = {
            code: 0,
            message: "用户注册成功",
            result: {
                id: res.id,
                user_name: res.user_name
            }
        };
    }

    async login(ctx, next) {
        ctx.body = "登录成功";
    }
}

module.exports = new UserController();
```

## 十、错误处理

### 1 合法性

判断所传参数是否合法

改写`src/controller/user.controller.js`

```js
// 合法性
if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body);
    ctx.status = 400;
    ctx.body = {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
    };
    return;
}
```

### 2 合理性

判断逻辑中数据是否符合要求

```js
// 合理性
if (await getUserInfo({ user_name, password })) {
    ctx.status = 409;
    ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: ''
    }
    return
}
```

改写`src/service/user.service.js`

```js
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

    async getUserInfo({ id, user_name, password, is_admin }) {
        const whereOpt = {};
        id && Object.assign(whereOpt, { id });
        user_name && Object.assign(whereOpt, { user_name });
        password && Object.assign(whereOpt, { password });
        is_admin && Object.assign(whereOpt, { is_admin });

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'is_admin'],
            where: whereOpt
        });
        return res ? res.dataValues : null;
    }
}

module.exports = new UserService();
```

## 十一. 拆分中间件

为了使代码的逻辑更加清晰, 我们可以拆分一个中间件层, 封装多个中间件函数

![image-20210524154353520](F:/typora-image/image-20210524154353520.png)

### 1 拆分中间件

添加`src/middleware/user.middleware.js`

```js
const { getUerInfo } = require('../service/user.service')
const { userFormateError, userAlreadyExited } = require('../constant/err.type')

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }

  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  if (getUerInfo({ user_name })) {
    ctx.app.emit('error', userAlreadyExited, ctx)
    return
  }

  await next()
}

module.exports = {
  userValidator,
  verifyUser,
}
```

### 2 统一错误处理

- 在出错的地方使用`ctx.app.emit`提交错误
- 在 app 中通过`app.on`监听

编写统一的错误定义文件

```js
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: '',
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已经存在',
    result: '',
  },
}
```

### 3 错误处理函数

```js
module.exports = (err, ctx) => {
  let status = 500
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break
    default:
      status = 500
  }
  ctx.status = status
  ctx.body = err
}
```

改写`app/index.js`

```js
const errHandler = require('./errHandler')
// 统一的错误处理
app.on('error', errHandler)
```



## 十二、加密
