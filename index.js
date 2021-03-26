const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');
const methodOverride = require('method-override');

/* START: Express set up */
const express = require('express');
const Recipe = require("./models/recipe");
const app = express();
const port = 3000;

// view engine setup
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
    const recipe = await Recipe.findById(id);
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

    // ToDo: Delete this section of comments when saving a recipe is verified good
    // if (req.body.prepBowls.length > 0) {
    //     newRecipe.prepBowls = req.body.prepBowls.split('\r\n');
    // } else {
    //     newRecipe.prepBowls = undefined
    // }
    // if (req.body.directions.length > 0) newRecipe.directions = req.body.directions.split('\r\n')
    // if (req.body.specialEquipment.length > 0) newRecipe.specialEquipment = req.body.specialEquipment.split('\r\n')
    // if (req.body.specialEquipment.length > 0) newRecipe.specialEquipment = req.body.specialEquipment.split('\r\n')
    // if (req.body.notes.length === 0) newRecipe.notes = undefined
    // res.send(newRecipe)
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
    await Recipe.findByIdAndDelete(id)
    res.redirect('/recipes')
});

app.listen(port, () => console.log(chalk.greenBright(`Listening on http://localhost:${port}`)));