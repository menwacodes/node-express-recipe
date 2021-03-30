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

// routes
const recipeRoutes = require('./routes/recipes')
const ingredientRoutes = require('./routes/ingredients')
const searchRoutes = require('./routes/search')
app.use('/recipes', recipeRoutes)
app.use('/recipes/:recipeId/ingredients', ingredientRoutes)
app.use('/search', searchRoutes)


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

// redirect for '/'
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.listen(port, () => console.log(chalk.greenBright(`Listening on http://localhost:${port}`)));