const express = require('express');
const path = require('path');
const port = process.env.PROT || 3000;
// const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const routes = require('./app/routes');
const bodyParser = require('body-parser');

mongoose.connect(config.mongodb, {useNewUrlParser: true});

app.locals.moment = require('moment');

// 设置模板目录
app.set('views', path.join(__dirname, 'app/views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

// session 中间件
app.use(session({
    name: config.session.key, // 设置cookie中保存session id 的字段名称
    secret: config.session.secret, // 设置secret来计算hash值并放在cookie中, 使产生的signedCookie 防篡改
    resave: true, // 强制更新session
    saveUninitialized: false, // 设置为false, 强制创建一个session, 即使用户未登录
    cookie: {
        maxAge: config.session.maxAge, // 过期时间, 过期后cookie中的session id 自动删除
    },
    store: new MongoStore({ // 将session 存到mongodb
        url: config.mongodb, // mongodb 的地址
    }),
}));

// flash中间件, 用来显示通知
// app.use(flash());
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


// 添加模板必须的三个变量
app.use(function(req, res, next) {
    res.locals.user = req.session.user
    next()
})


// 路由
routes(app);

app.listen(port, function() {
    console.log('Server listening on port '+port);
});
