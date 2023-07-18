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