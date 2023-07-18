const Koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
    ctx.body = 'HELLO WORLD'
})

app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000");
})