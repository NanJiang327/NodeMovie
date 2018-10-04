const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const Category = require('../models/category')
const User = require('../models/users');
const _ = require('underscore');

// GET /admin/movie/update/:id
router.get('/movie/update/:id', function(req, res) {
    const id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, category) {
                res.render('admin', {
                    title: 'Admin Update',
                    movie: movie,
                    category: category,
                })
            })
        })
    }
})

// GET /admin/movie/new
router.get('/movie/new', function(req, res) {
    Category.find({}, function(err, category) {
        res.render('admin', {
            title: 'admin',
            category: category,
            movie: {},
        });
    })
});

// POST /admin/movie/new
router.post('/movie/new', function(req, res) {
    const id = req.body.movie._id;
    const movieObj = req.body.movie;
    let _movie;
    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    consoel.log(err);
                }

                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie(movieObj)
        const categoryId = _movie.category;
        const categoryName = movieObj.categoryName;

        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(_movie._id);

                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            } else if (categoryName) {
                const category = new Category({
                    name: categoryName,
                    movies: [movie._id],
                })

                category.save(function(err, category) {
                    _movie.category = category._id;
                    _movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id);
                    });
                })
            }
        })
    }
});

// Movie List

// GET admin/movie/list
router.get('/movie/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'List',
            movies: movies,
        });
    })
});

// DELETE admin/movie/list
router.delete('/movie/list', function(req, res) {
    const id = req.query.id;
    if (id) {
        Movie.deleteOne({_id: id}, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
});

// User List

// GET /admin/user/list
router.get('/user/list', function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userlist', {
            title: 'User list',
            users: users,
        })
    })
})


// Category
// GET /admin/movie/category
router.get('/category/new', function(req, res) {
    res.render('category', {
        title: 'Category',
        category: {

        },
    });
});

// POST /admin/movie/category
router.post('/category/new', function(req, res) {
    const categoryObj = req.body.category;
    let _category;

    _category = new Category(categoryObj);

    _category.save(function(err, movie) {
        if (err) {
            console.log(err);
        }

        res.redirect('/admin/category/list');
    })
})

// DELETE admin/category/list
router.delete('/category/list', function(req, res) {
    const id = req.query.id;
    if (id) {
        Category.deleteOne({_id: id}, function(err, category) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
});

// Category list

// GET /admin/categorylist
router.get('/category/list', function(req, res) {
    Category.fetch(function(err, cate) {
        if (err) {
            console.log(err);
        }

        res.render('categorylist', {
            title: 'Category list',
            category: cate,
        })
    })
})

module.exports = router;
