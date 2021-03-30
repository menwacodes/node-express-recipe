const Recipe = require('./models/recipe');
const Ingredient = require("./models/ingredient");
const recipeSeeds = require('./seedRecipes');
const ingredientSeeds = require('./seedIngredients');


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
        const results = await Recipe.insertMany(seeds);

        // create ingredients
        // loop through recipes
        for (const result of results) {
            // grab the slug (common to both) and get the ingredients from array
            let slug = result.slug;
            const ingredients = ingredientSeeds.ingredients.find(ing => ing.slug === slug)
            // loop through ingredients, create one, add to recipe, add recipe to ingredient (two way association), then save
            for (const ingredient of ingredients.ingredients) {
                const newIngredient = new Ingredient({amount: ingredient["amount"], measure:ingredient["measure"], prep: ingredient["prep"], ingredient: ingredient["ingredient"]})
                result.ingredients.push(newIngredient)
                newIngredient.recipe = result

                await result.save()
                await newIngredient.save()
            }
        }

    } catch (err) {
        console.log(err);
    }
};

seedDB(recipeSeeds.recipes)
    .then(()=> mongoose.connection.close())
