const express = require('express');
const Recipe = require("../models/recipe");
const methodOverride = require('method-override');

// prefix /recipes

const router = express.Router();

/* Helper Functions - ToDo: move to separate file */
/**
 *
 * @param recipeTextArea: req.body.textarea
 * @returns {undefined|array}
 */
const recipeTextAreaToArray = recipeTextArea => {
    if (recipeTextArea.length > 0) return recipeTextArea.split('\r\n');
    else return undefined; // account for empty entries

};

const recipeArrayToTextArea = recipeArr => {
    if (recipeArr) return recipeArr.join('\r\n');
    // else return undefined;
};

/* END: Helper Functions */

// method override
router.use(methodOverride('_method'));

// enums
const coursesArray = Recipe.schema.path('course').enumValues;


// Index
router.get('/', async (req, res) => {
    const recipes = await Recipe.find({});
    res.render('recipes/index', {recipes});
});

// New (form)
router.get('/new', (req, res) => {
    res.render('recipes/new', {coursesArray});
});

// Show
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id).populate('ingredients');
    res.render('recipes/show', {recipe});
});


// Create
router.post('/', async (req, res, next) => {
    // content from text areas: use .split('\r\n') to make an array, then map and push
    const newRecipe = new Recipe(req.body);

    // account for empty entries
    newRecipe.prepBowls = recipeTextAreaToArray(req.body.prepBowls);
    newRecipe.directions = recipeTextAreaToArray(req.body.directions);
    newRecipe.specialEquipment = recipeTextAreaToArray(req.body.specialEquipment);
    newRecipe.notes = recipeTextAreaToArray(req.body.notes);

    const data = await newRecipe.save();
    res.redirect(`/${newRecipe._id}`);

});

// Edit form
router.get('/:id/edit', async (req, res) => {
    // will need .join('\r\n')
    // get the recipe by id and send up to form
    const {id} = req.params;
    const recipe = await Recipe.findById(id);

    // convert stored array into text area presentable
    recipe.prepBowls = recipeArrayToTextArea(recipe.prepBowls);
    recipe.directions = recipeArrayToTextArea(recipe.directions);
    recipe.specialEquipment = recipeArrayToTextArea(recipe.specialEquipment);
    recipe.notes = recipeArrayToTextArea(recipe.notes);
    res.render('recipes/edit', {recipe, coursesArray});
});

// Update Recipe
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    // Find the Recipe
    const recipe = await Recipe.findById(id);

    // Start by taking data from the body and updating the recipe
    // Note: the names need to match what is in the model
    //     Form does not have any fields not found in model
    for (const bodyKey in req.body) {
        recipe[bodyKey] = req.body[bodyKey];
    }

    // Update the array fields in recipe
    recipe.prepBowls = recipeTextAreaToArray(req.body.prepBowls);
    recipe.directions = recipeTextAreaToArray(req.body.directions);
    recipe.specialEquipment = recipeTextAreaToArray(req.body.specialEquipment);
    recipe.notes = recipeTextAreaToArray(req.body.notes);

    // Save Recipe
    await recipe.save();

    res.redirect(`/recipes/${recipe._id}`);
});

// Delete Recipe
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect('/recipes');
});


module.exports = router;