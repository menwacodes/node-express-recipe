const Recipe = require('./models/recipe');
const Ingredient = require("./models/ingredient");
const recipeSeeds = require('./seedRecipes');

const mongoose = require('mongoose');
const chalk = require('chalk');

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


const seedDB = async seeds => {
    try {
        // clear existing data
        await Recipe.deleteMany({});
        await Ingredient.deleteMany({})

        // CREATE DATA FROM SEEDS
        // create recipes
        const res = await Recipe.insertMany(seeds);

        /* create ingredients
            loop through the recipes
            grab the id and the slug
            grab the ingredients that have the same slug
            loop through the ingredients and
              create an ingredient and add the recipe object id
              for each newly created ingredient, grab the id and push into a temporary array
              loop through the temporary array
                update (push) the recipe's ingredient with the object ids
            */

        console.log(res);

    } catch (err) {
        console.log(err);
    }
};

seedDB(recipeSeeds.recipes)
    .then(()=> mongoose.connection.close())
