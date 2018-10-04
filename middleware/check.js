module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/signin');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            return res.redirect('back'); // 返回之前页面
        }
        next();
    },

    checkAdmin: function checkAdmin(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/user/signin');
        }

        if (req.session.user.role <= 10) {
            return res.redirect('/main');
        }
        next();
    },
};
