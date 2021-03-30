const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const flash = require('connect-flash');


// auth
const session = require('express-session');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const sessionConfig = {
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

/* START: Express set up */
const express = require('express');
const Recipe = require("./models/recipe");
const Ingredient = require("./models/ingredient");
const app = express();
const port = 3000;

// view engine setup
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})); // remove if not using form

// passport session config
app.use(session(sessionConfig));
app.use(flash());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



// assets
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// Middleware for all calls
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    console.log(res.locals)
    next()
})

// routes
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');

app.use('/recipes', recipeRoutes);
app.use('/recipes/:recipeId/ingredients', ingredientRoutes);
app.use('/search', searchRoutes);
app.use('/recipes/welcome', userRoutes)




/* mongoose local set up */
const mURL = 'mongodb://localhost:27017/';
const mDB = 'recipe';
const mOptions = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true};

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