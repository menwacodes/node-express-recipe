const mongoose = require('mongoose');
const chalk = require('chalk')
const path = require('path')

/* START: Express set up */
const express = require('express')
const Recipe = require("./models/recipe");
const app = express()
const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})) // remove if not using form

// assets
app.use(express.static(path.join(__dirname, 'public')))

// enums
const coursesArray = Recipe.schema.path('course').enumValues


/* local set up */
const mURL = 'mongodb://localhost:27017/'
const mDB = 'recipe'
const mOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }


const connect =  async () => {
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

// RECIPE ROUTES
// redirect for '/'
app.get('/', (req, res) => {
    res.redirect('/recipes')
})

// Index
app.get('/recipes', async (req, res)=> {
    const recipes = await Recipe.find({})
    res.render('recipes/index', {recipes})
})

// New (form)
app.get('/recipes/new', (req, res) => {
    res.render('recipes/new', {coursesArray})
})

// Show
app.get('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id)
    res.render('recipes/show',{recipe})
})

// Create
app.post('/recipes', async (req, res, next) => {
    // content from text areas: use .split('\r\n') to make an array, then map and push
    const newRecipe = new Recipe(req.body)
    let dirs = req.body.directions.split('\r\n')
    if (req.body.prepBowls) newRecipe.prepBowls = req.body.prepBowls.split('\r\n')
    if (req.body.directions) newRecipe.directions = req.body.directions.split('\r\n')
    if (req.body.specialEquipment) newRecipe.specialEquipment = req.body.specialEquipment.split('\r\n')
    if (req.body.notes) newRecipe.notes = req.body.notes.split('\r\n')
    const data = await newRecipe.save()
    res.redirect(`/recipes/${newRecipe._id}`)
})

app.listen(port, ()=>console.log(chalk.greenBright(`Listening on http://localhost:${port}`)))