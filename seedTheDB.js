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

        for (const result of results) {
            let slug = result.slug;
            // let id = result._id;
            const ingredients = ingredientSeeds.ingredients.find(ing => ing.slug === slug)
            console.log(ingredients.ingredients)
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
