const checkAdmin = require('../../middleware/check').checkAdmin;

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/main');
    });

    app.use('/admin', checkAdmin, require('./admin'));
    app.use('/movie', require('./detail'));
    app.use('/main', require('./main'));
    app.use('/user', require('./user'));
    app.use('/logout', require('./logout'));
    app.use('/result', require('./search'));


    app.use(function(req, res) {
        if (!res.headersSent) {
            res.status(404).render('404');
        }
    });
}
