const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET /main
router.get('/', function(req, res) {
    Category.find({})
        .populate({path: 'movies', optiond: {limit: 5}})
        .exec(function(err, categories) {
            res.render('index', {
                title: 'Main',
                category: categories,
            });
        })
});


module.exports = router;
