// 导入config中的固定数据
const { APP_PORT } = require('./config/config.default');
const app = require('./app');

app.listen(APP_PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${APP_PORT}`);
})