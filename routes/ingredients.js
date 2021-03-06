// prefix /recipes/:recipeId/ingredients
const express = require('express');
const Recipe = require("../models/recipe");
const methodOverride = require('method-override');
const Ingredient = require("../models/ingredient");
const {isLoggedIn} = require("../middleware");
const {isIngredientOwner} = require("../middleware");
const router = express.Router({mergeParams: true});


// Create Ingredient Form
router.get('/new', async (req, res) => {
    const {recipeId} = req.params;
    const recipe = await Recipe.findById(recipeId).populate('ingredients');
    // res.send({ingredients: recipe.ingredients, recipeId})
    res.render('ingredients/new.ejs', {ingredients: recipe.ingredients, recipeId, recipeName: recipe.name});
});

// Create Ingredient
router.post('/', isLoggedIn, async (req, res) => {
    // Get Recipe
    const {recipeId} = req.params;
    const recipe = await Recipe.findById(recipeId);

    // Get Ingredients from form and create object
    const {amount, measure, prep, ingredient} = req.body;
    const newIngredient = new Ingredient({amount, measure, prep, ingredient});

    // Two way association
    recipe.ingredients.push(newIngredient);
    newIngredient.recipe = recipe;

    // Save recipe and ingredient
    await recipe.save();
    await newIngredient.save();

    req.flash('success', 'Created Ingredient')

    res.redirect(`/recipes/${recipe._id}/ingredients/new`);
});

// Delete Ingredient
router.delete('/:id', isIngredientOwner,  async (req, res) => {
    const {recipeId, id} = req.params;
    // delete from recipe
    await Recipe.findByIdAndUpdate(recipeId, {$pull: {ingredients: id}});

    // delete from ingredients
    await Ingredient.findByIdAndDelete(id);

    req.flash('success', 'Deleted Ingredient')

    res.redirect(`/recipes/${recipeId}/ingredients/new`);
});

module.exports = router;
