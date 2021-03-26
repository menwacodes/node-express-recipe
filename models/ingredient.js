const mongoose = require('mongoose');

const {Schema} = mongoose;

const ingredientSchema = new Schema({
    amount: Number,
    measure: String,
    prep: String,
    ingredient: String,
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }
});

ingredientSchema.statics.findByIngredient = function (ingredient){
    return this.find({ingredient: new RegExp(ingredient, 'i')}, 'recipe').populate({path:'recipe', select: ['name']})
}

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;