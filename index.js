const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')

/* START: Express set up */
const express = require('express');
const Recipe = require("./models/recipe");
const Ingredient = require("./models/ingredient");
const app = express();
const port = 3000;

// view engine setup
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})); // remove if not using form

// assets
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// enums
const coursesArray = Recipe.schema.path('course').enumValues;


/* local set up */
const mURL = 'mongodb://localhost:27017/';
const mDB = 'recipe';
const mOptions = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};


const connect = async () => {
    try {
        await mongoose.connect(mURL + mDB, mOptions);
        console.log(chalk.bgGreen("Mongo Connection Open"));
    } catch (e) {
        console.log(chalk.bgRed.yellowBright(`Mongo Connection Error: ${e.message}`));
        console.log(e);
    }
};

connect();

/* END: Mongoose set up */

/* Helper Functions - ToDo: move to separate file */
/**
 *
 * @param recipeTextArea: req.body.textarea
 * @returns {undefined|array}
 */
const recipeTextAreaToArray = recipeTextArea => {
    if (recipeTextArea.length > 0) return recipeTextArea.split('\r\n');
    else return undefined;
};

// RECIPE ROUTES
// redirect for '/'
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

// Index
app.get('/recipes', async (req, res) => {
    const recipes = await Recipe.find({});
    res.render('recipes/index', {recipes});
});

// New (form)
app.get('/recipes/new', (req, res) => {
    res.render('recipes/new', {coursesArray});
});

// Show
app.get('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id).populate('ingredients');
    res.render('recipes/show', {recipe});
});


// Create
app.post('/recipes', async (req, res, next) => {
    // content from text areas: use .split('\r\n') to make an array, then map and push
    const newRecipe = new Recipe(req.body);

    // account for empty entries
    newRecipe.prepBowls = recipeTextAreaToArray(req.body.prepBowls);
    newRecipe.directions = recipeTextAreaToArray(req.body.directions);
    newRecipe.specialEquipment = recipeTextAreaToArray(req.body.specialEquipment);
    newRecipe.notes = recipeTextAreaToArray(req.body.notes);

    const data = await newRecipe.save();
    res.redirect(`/recipes/${newRecipe._id}`);

});

const recipeArrayToTextArea = recipeArr => {
    if (recipeArr) return recipeArr.join('\r\n');
    // else return undefined;
};

// Edit form
app.get('/recipes/:id/edit', async (req, res) => {
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
app.put('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    // Find the Recipe
    const recipe = await Recipe.findById(id);

    // Update the array fields
    // account for empty entries
    recipe.prepBowls = recipeTextAreaToArray(req.body.prepBowls);
    recipe.directions = recipeTextAreaToArray(req.body.directions);
    recipe.specialEquipment = recipeTextAreaToArray(req.body.specialEquipment);
    recipe.notes = recipeTextAreaToArray(req.body.notes);

    // Save Recipe
    await recipe.save();

    res.redirect(`/recipes/${recipe._id}`);
});

// Delete Recipe
app.delete('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect('/recipes');
});

// INGREDIENT ROUTES
// Create Ingredient Form
app.get('/recipes/:recipeId/ingredients/new', async (req, res) => {
    const {recipeId} = req.params;
    const recipe = await Recipe.findById(recipeId).populate('ingredients');
    // res.send({ingredients: recipe.ingredients, recipeId})
    res.render('ingredients/new.ejs', {ingredients: recipe.ingredients, recipeId, recipeName: recipe.name});
});

// Create Ingredient
app.post('/recipes/:recipeId/ingredients', async (req, res) => {
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

    res.redirect(`/recipes/${recipe._id}/ingredients/new`);
});

// Delete Ingredient
app.delete('/recipes/:recipeId/ingredients/:ingredientId', async (req, res) => {
    const {recipeId, ingredientId} = req.params;
    // delete from recipe
    await Recipe.findByIdAndUpdate(recipeId, {$pull: {ingredients: ingredientId}});

    // delete from ingredients
    await Ingredient.findByIdAndDelete(ingredientId);

    res.redirect(`/recipes/${recipeId}/ingredients/new`);
});

// SEARCH ROUTES
// Find by Ingredient
app.post('/search/ingredient', async (req, res) => {
    // const {ingredient} = req.params;
    const {search} = req.body
    const results = await Ingredient.findByIngredient(search)
    console.log(results)
    res.render('search/byIngredient', {results})
})

app.listen(port, () => console.log(chalk.greenBright(`Listening on http://localhost:${port}`)));