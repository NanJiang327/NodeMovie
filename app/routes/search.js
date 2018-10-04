const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Movie = require('../models/movies');

// GET /search
router.get('/', function(req, res) {
    const cateId = req.query.cate;
    const page = parseInt(req.query.p, 10) || 0;
    const q = req.query.q;
    const count = 2;
    const index = page * count;

    if (cateId) {
        Category.find({_id: cateId})
            .populate({path: 'movies', search: 'title poster'})
            .exec(function(err, categories) {
                if (err) {
                    console.log(err)
                }
                const category = categories[0] || {}
                const movies = category.movies || [];
                const results = movies.slice(index, index + count);

                res.render('results', {
                    title: 'Search Result',
                    keyword: category.name,
                    currentPage: page + 1,
                    query: 'cate=' + cateId,
                    movies: results,
                    totalPage: Math.ceil(movies.length / count),
                });
            })
    } else {
        Movie.find({title: new RegExp(q+ '.*', 'i')})
            .exec(function(err, movies) {
                if (err) {
                    console.log(err)
                }
                const results = movies.slice(index, index + count);

                res.render('results', {
                    title: 'Search Result',
                    keyword: q,
                    currentPage: page + 1,
                    query: 'q=' + q,
                    movies: results,
                    totalPage: Math.ceil(movies.length / count),
                });
            })
    }
});


module.exports = router;
