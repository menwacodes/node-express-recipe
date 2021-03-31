const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

let mongoUri = process.env.MONGO_ATLAS_URI;
const mURL = 'mongodb://localhost:27017/';
const mDB = 'recipe';
mongoUri = mURL + mDB;

const flash = require('connect-flash');


// auth
const session = require('express-session');
const MongoStore = require('connect-mongo');

const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const store = new MongoStore({
    mongoUrl: mongoUri,
    crypto: {
        secret: process.env.APP_SECRET,
    },
    touchAfter: 24 * 3600, // update store every 24h only if the page hasn't been changed
});

store.on('error', function (e) {
    console.log(e);
});

const sessionConfig = {
    store,
    name: "hbgc_29", // changes default name of session
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // uncomment for deploy (localhost not secure)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

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

app.use(mongoSanitize());

// passport session config
app.use(session(sessionConfig));


app.use(flash());

const scriptSrcUrls = [
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["self"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // console.log(res.locals)
    next();
});

// routes
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');

app.use('/recipes', recipeRoutes);
app.use('/recipes/:recipeId/ingredients', ingredientRoutes);
app.use('/search', searchRoutes);
app.use('/recipes/welcome', userRoutes);

/* mongoose local set up
    comment out and use variable from top if using cloud
* */


const mOptions = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true};

const connect = async () => {
    try {
        await mongoose.connect(mongoUri, mOptions);
        console.log(chalk.bgGreen("Mongo Connection Open"));
    } catch (e) {
        console.log(chalk.bgRed.yellowBright(`Mongo Connection Error: ${e.message}`));
        console.log(e);
    }
};

// mongodb+srv://admin-menwa:<password>@recipecluster.9nncm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

connect();
/* END: Mongoose set up */

// redirect for '/'
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.listen(port, () => console.log(chalk.greenBright(`Listening on http://localhost:${port}`)));