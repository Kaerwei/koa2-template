const Koa = require('koa');
const { koaBody } = require('koa-body');

const router = require('../router');
const errorHandler = require('../app/errorHandler');

const app = new Koa();

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', errorHandler);

module.exports = app;