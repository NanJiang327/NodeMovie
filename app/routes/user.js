const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Comment = require('../models/comment');
const sha1 = require('sha1');
const checkLogin = require('../../middleware/check').checkLogin;


// GET /signup
router.get('/signup', function(req, res) {
    if (req.session.user) {
        res.redirect('/main');
    } else {
        res.render('signup', {
            title: 'Sign up',
        })
    }
})


// POST  /user/singup
router.post('/signup', function(req, res) {
    const _user = req.body.user;
    _user.password = sha1(_user.password);

    User.findOne({name: _user.name}, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            return res.redirect('/user/signin');
        } else {
            const user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/main');
            })
        }
    })
    // req.parm
})


// GET /signin
router.get('/signin', function(req, res) {
    if (req.session.user) {
        res.redirect('/main');
    } else {
        res.render('signin', {
            title: 'Sign in',
        })
    }
})


// POST /user/singin
router.post('/signin', function(req, res) {
    const _user = req.body.user;
    const name = _user.name;
    const password = sha1(_user.password);

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            console.log('User is not exist');
            return res.redirect('/user/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                req.session.user = user;
                return res.redirect('back');
            } else {
                console.log('Password is not matched');
                return res.redirect('/user/signin');
            }
        })
    })
})

// Comment

// POST /admin/comment
router.post('/comment', checkLogin, function(req, res) {
    const _comment = req.body.comment;
    const movieId = _comment.movie;

    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            const reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content,
            }

            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' +movieId);
            })
        })
    } else {
        const comment = new Comment(_comment);

        comment.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' +movieId);
        })
    }
})

module.exports = router;
