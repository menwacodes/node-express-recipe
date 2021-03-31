/*
Logged In:
    Add Recipe

Owner:
    Edit, Delete Recipe
    Delete, Edit, Manage Ingredients (isIngredientOwner)

 */

const Recipe = require("./models/recipe");
const Ingredient = require("./models/ingredient");

module.exports.isLoggedIn = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            req.flash('error', 'You must be logged in to do that');
            return res.redirect('/recipes/welcome/login');
        }
    } catch (e) {
        console.log(`Error: ${e}`);

    }
    return next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const {id} = req.params;
        // find recipe then check to see if it's owner is same as current user
        const recipe = await Recipe.findById(id);
        if (!recipe.owner.equals(req.user._id)) {
            req.flash('error', 'You do not own this recipe');
            return res.redirect(`/recipes/${id}`);
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }

    return next();
};

module.exports.isIngredientOwner = async (req, res, next) => {
    const {id, recipeId} = req.params
    // find ingredient then check to see if the owner is the same, redirect to recipe if not
    const ingredient = await Ingredient.findById(id).populate({path: 'recipe', select: 'owner'});
    if (!ingredient.recipe.owner.equals(req.user._id)) {
        req.flash('error', 'You do not own this recipe')
       return res.redirect(`/recipes/${recipeId}`)
    }
    return next()
};