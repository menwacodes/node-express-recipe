// prefix /search

const express = require('express');
const Ingredient = require("../models/ingredient");
const router = express.Router();


// Find by Ingredient
router.post('/ingredient', async (req, res) => {
    const {search} = req.body;
    let results;
    if (search === '') {
        req.flash('error', 'Please enter a search term');
        return res.redirect('/');
    } else {
        results = await Ingredient.findByIngredient(search);
    }
    return res.render('search/byIngredient', {results});
});

module.exports = router;
