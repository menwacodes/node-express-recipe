const User = require("./models/user");
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

        await User.deleteMany({})

        // CREATE USER MIKE
        const mike = await new User({
            name: 'menwa',
            email: 'menwa.codes@gmail.com',
            username: 'mike'
        })

        const registeredMike = await User.register(mike, process.env.MIKE_PASS)
        const recipeOwnerId = registeredMike._id

        // CREATE DATA FROM SEEDS
        // create recipes
        const results = await Recipe.insertMany(seeds);

        // create ingredients
        // loop through recipes
        for (const result of results) {
            // update the mike owner
            result.owner = recipeOwnerId;
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
