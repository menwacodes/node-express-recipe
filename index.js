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

// Show
app.get('/recipes/:id', async (req, res) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id)
    res.render('recipes/show',{recipe})
})


app.listen(port, ()=>console.log(chalk.greenBright(`Listening on http://localhost:${port}`)))