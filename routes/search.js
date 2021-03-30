// prefix /search

const express = require('express');
const Ingredient = require("../models/ingredient");
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Find by Ingredient
router.post('/ingredient', async (req, res) => {
    const {search} = req.body
    const results = await Ingredient.findByIngredient(search)
    res.render('search/byIngredient', {results})
})

module.exports = router;
