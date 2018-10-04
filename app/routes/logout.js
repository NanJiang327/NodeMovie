const express = require('express');
const router = express.Router();

// GET /logout
router.get('/', function(req, res) {
    delete req.session.user;

    res.redirect('back');
})


module.exports = router;
