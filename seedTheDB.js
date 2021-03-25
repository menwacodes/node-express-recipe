const Recipe = require('./models/recipe');
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

// const recipeSeeds = [
//     {
//         slug: "ma-po-tofu",
//         name: "Ma Po Tofu",
//         yield: "4 servings",
//         course: "Mains",
//         prepTime: 15,
//         cookTime: 10,
//         activeTime: 25,
//         marinateTime: 0,
//         from: "https://www.seriouseats.com/recipes/2011/07/real-deal-mapo-dofu-tofu-chinese-sichuan-recipe.html",
//         attribution: 'J. Kenji López-Alt',
//         prepBowls: [
//             "3 cloves garlic & 1 tbsp ginger",
//             "2 tbsp Chili bean paste, 2 tbsp xiaoxing wine, 1/4C chicken stock, 1tbsp soy sauce",
//             "Half the peppercorns",
//             "1/4C Chilli oil & half of 1/4C scallions",
//             "Tofu, cut into 1/2 inch cubes"
//         ],
//         directions: [
//             "Heat half of sichuan peppercorns in a large wok over high heat until lightly smoking. Transfer to a mortar and pestle. Pound until finely ground and set aside.",
//             "Add remaining sichuan peppercorns and vegetable oil to wok. Heat over medium high heat until lightly sizzling, about 1 1/2 minutes. Pick up peppercorns with a wire mesh skimmer and discard, leaving oil in pan.",
//             "Combine corn starch and cold water in a small bowl and mix with a fork until homogenous.",
//             "Bring a medium saucepan of water to a boil over high heat and add tofu. Cook for 1 minute. Drain in a colander, being careful not to break up the tofu.",
//             "Heat oil in wok over high heat until smoking. Add beef and cook, stirring constantly for 1 minute.",
//             "Add garlic and ginger and cook until fragrant, about 15 seconds.",
//             "Add chili-bean paste, wine, soy sauce, and chicken stock and bring to a boil.",
//             "Pour in corn starch mixture and cook for 30 seconds until thickened.",
//             "Add tofu and carefully fold in, being careful not to break it up too much.",
//             "Stir in chili oil and half of scallions and simmer for 30 seconds longer.",
//             "Transfer immediately to a serving bowl and sprinkle with remaining scallions and toasted ground Sichuan pepper. Serve immediately with white rice."
//         ],
//         specialEquipment: ['Wok']
//     },
//     {
//         slug: "focaccia-bread",
//         name: "Focaccia Bread",
//         yield: "16 servings",
//         course: "Breads",
//         prepTime: 30,
//         cookTime: 17,
//         activeTime: 30,
//         totalRiseTime: 80,
//         from: "https://www.inspiredtaste.net/19313/easy-focaccia-bread-recipe-with-herbs/",
//         attribution: 'Adam',
//         doughDirections: [
//             "In a cold medium skillet, combine olive oil, minced garlic, thyme, rosemary, and the black pepper. Place the pan over low heat and cook, stirring occasionally, 5 to 10 minutes or until aromatic, but before the garlic browns. Set aside.",
//             "In a large bowl, combine the warm water, yeast, and honey. Stir a few times then let sit for 5 minutes.",
//             "Add 1 cup of the flour and a 1/4 cup of the infused garlic-olive oil mixture to the bowl with yeast and honey. Stir 3 to 4 times until the flour has moistened. Let sit for another 5 minutes.",
//             "Stir in the remaining 1 1/2 cups of flour and the salt. When the dough comes together, transfer to a floured board and knead 10 to 15 times until smooth",
//             "Transfer the dough to a large oiled bowl, cover with a warm, damp towel and let rise for 1 hour. (It’s best to let the dough rise in a warmer area of your kitchen).",
//         ],
//         bakingDirections: [
//             "After 1 hour, heat the oven to 450 degrees Fahrenheit.",
//             "Use two tablespoons of the remaining garlic-olive oil mixture to oil a 9-inch by 13-inch rimmed baking sheet.",
//             "Transfer the dough to the baking sheet then press it down into the pan. Use your fingers to dimple the dough then drizzle the top with the remaining 2 tablespoons of the garlic-olive oil mixture. Let the dough rise for 20 minutes until it puffs slightly.",
//             "Bake until golden brown, 15 to 20 minutes. Cool baked focaccia bread on a wire rack.",
//         ],
//         directions: [
//             "For the Dough:",
//             "In a cold medium skillet, combine olive oil, minced garlic, thyme, rosemary, and the black pepper. Place the pan over low heat and cook, stirring occasionally, 5 to 10 minutes or until aromatic, but before the garlic browns. Set aside.",
//             "In a large bowl, combine the warm water, yeast, and honey. Stir a few times then let sit for 5 minutes.",
//             "Add 1 cup of the flour and a 1/4 cup of the infused garlic-olive oil mixture to the bowl with yeast and honey. Stir 3 to 4 times until the flour has moistened. Let sit for another 5 minutes.",
//             "Stir in the remaining 1 1/2 cups of flour and the salt. When the dough comes together, transfer to a floured board and knead 10 to 15 times until smooth",
//             "Transfer the dough to a large oiled bowl, cover with a warm, damp towel and let rise for 1 hour. (It’s best to let the dough rise in a warmer area of your kitchen).",
//             "For Baking:",
//             "After 1 hour, heat the oven to 450 degrees Fahrenheit.",
//             "Use two tablespoons of the remaining garlic-olive oil mixture to oil a 9-inch by 13-inch rimmed baking sheet.",
//             "Transfer the dough to the baking sheet then press it down into the pan. Use your fingers to dimple the dough then drizzle the top with the remaining 2 tablespoons of the garlic-olive oil mixture. Let the dough rise for 20 minutes until it puffs slightly.",
//             "Bake until golden brown, 15 to 20 minutes. Cool baked focaccia bread on a wire rack.",
//         ],
//         notes: [
//             "Can substitute 1 tbsp fresh thyme/rosemary",
//             "Refrigerate or freeze leftover focaccia. Wrap it tightly in plastic wrap, then in foil. Keep in the refrigerator up to 2 days and in the freezer for about a month."
//         ]
//     },
//     {
//         slug: "stuffed-peppers-with-meat",
//         name: "Stuffed Peppers with Meat",
//         yield: "6 servings",
//         course: "Mains",
//         prepTime: 10,
//         activeTime: 14,
//         cookTime: 45,
//         from: "https://www.delish.com/cooking/recipe-ideas/a23014857/classic-stuffed-peppers-recipe/",
//         attribution: 'Rian Handler',
//         directions: [
//             "Preheat oven to 400°. In a small saucepan, prepare rice according to package instructions.",
//             "In a large skillet over medium heat, heat oil. Cook onion until soft, about 5 minutes.",
//             "Stir in tomato paste and garlic and cook until fragrant, about 1 minute more.",
//             "Add ground beef and cook, breaking up meat with a wooden spoon, until no longer pink, 6 minutes.",
//             "Drain fat.",
//             "Return beef mixture to skillet, then stir in cooked rice and diced tomatoes. Season with oregano, salt, and pepper. Let simmer until liquid has reduced slightly, about 5 minutes.",
//             "Place peppers cut side-up in a 9\"-x-13\" baking dish and drizzle with oil. Spoon beef mixture into each pepper and top with Monterey jack, then cover baking dish with foil.",
//             "Bake until peppers are tender, about 35 minutes.",
//             "Uncover and bake until cheese is bubbly, 10 minutes more.",
//
//         ],
//         notes: []
//     },
//     {
//         slug: "hot-sauce-for-wings",
//         name: "Hot Sauce For Wings",
//         yield: "~1L",
//         course: "Sauces",
//         prepTime: 20,
//         cookTime: 30,
//         activeTime: 20,
//         from: "Tim the Mighty",
//         directions: [
//             "Halve the onion and char flat sides, put aside to cool",
//             "Cook garlic & peppers",
//             "Add a mix of vinegars, mostly red wine, and water",
//             "Add remainder of ingredients",
//             "Simmer for at least 30 min",
//             "Blend for 1 min",
//             "",
//             "",
//             "",
//             "",
//         ],
//         notes: [
//             "You'll need 2 500mL mason jars to put the sauce in",
//             "Add dried chilies to desired taste",
//             "Will last at least 2 weeks in fridge due to vinegar and salt content"
//         ]
//     },
//     {
//         slug: "try-me-sauce",
//         name: "Try Me Sauce",
//         yield: "~300mL",
//         course: "Sauces",
//         prepTime: 10,
//         cookTime: 60,
//         activeTime: 10,
//         from: "Menwa",
//         directions: [
//             "Under low heat with some oil/butter, soften the garlic & ginger, about 10 min",
//             "Add remainder of ingredients",
//             "Simmer for about 45-60 min, depending on desired consistency",
//             "Sauce should be able to coat the back of a spoon",
//         ],
//         notes: [
//             "Can use this in sous-vide bag while cooking",
//             "Can use as topping sauce for fish, pork"
//         ]
//     },
//     {
//         slug: "brioche-buns",
//         name: "Brioche Buns",
//         yield: "8 buns",
//         course: "Breads",
//         prepTime: 30,
//         cookTime: 17,
//         activeTime: 30,
//         totalRiseTime: 4,
//         from: "https://www.theclevercarrot.com/2013/05/light-brioche-hamburger-buns/",
//         attribution: 'Emilie Raffa',
//         doughDirections: [
//             "Whisk warm water, milk, yeast, sugar",
//             "Beat an egg",
//             "In the bowl of a stand mixer, add the flours, salt and butter. Using the paddle attachment, mix the ingredients until the butter is the size of crumbs.",
//             "Stir in yeast mixture and beaten egg. Run the mixer on medium-low (I used #2 on my Kitchen Aid) until a dough forms, about 5-8 minutes.",
//             "Scrape down the sides of the bowl if necessary, and shape the dough into a ball. It will be sticky.",
//             "Cover bowl with a damp kitchen towel and let the dough rise in a warm area* until it has doubled is size, 1- 3 hours @ 70 F, see notes",
//             "Line a baking sheet with parchment paper. Using a floured bench scraper, divide the dough into 8 equal pieces. If you have a scale, weigh each piece**.",
//             "Knead the dough pieces by flattening, picking up sides and folding in, flip and palm roll to make a ball",
//             "Repeat the kneading until the folding starts losing elasticity and the ball seems firmer",
//             "Transfer to your baking sheet, placing them a few inches inches apart.",
//             "Cover and rest for 1-2 hours, or until puffy and slightly risen.",
//             "To make the egg wash, beat the remaining egg with a splash of water. When the buns are finished with the 2nd rise, gently brush each one with egg wash.",
//             "If using sesame seeds, now is the time to add to top.",
//         ],
//         bakingDirections: [
//             "Preheat oven to 400F and place a skillet or metal baking dish on the oven floor or lower rack.",
//             "Before the dough goes in, add about 1/2 cup of water to the pan to create steam and keep the bread moist.",
//             "Bake for about 15-20 minutes or until golden brown.",
//             "Transfer to a wire rack to cool completely.",
//         ],
//         directions: [
//             "For the Dough:",
//             "Whisk warm water, milk, yeast, sugar",
//             "Beat an egg",
//             "In the bowl of a stand mixer, add the flours, salt and butter. Using the paddle attachment, mix the ingredients until the butter is the size of crumbs.",
//             "Stir in yeast mixture and beaten egg. Run the mixer on medium-low (I used #2 on my Kitchen Aid) until a dough forms, about 5-8 minutes.",
//             "Scrape down the sides of the bowl if necessary, and shape the dough into a ball. It will be sticky.",
//             "Cover bowl with a damp kitchen towel and let the dough rise in a warm area* until it has doubled is size, 1- 3 hours @ 70 F, see notes",
//             "Line a baking sheet with parchment paper. Using a floured bench scraper, divide the dough into 8 equal pieces. If you have a scale, weigh each piece**.",
//             "Knead the dough pieces by flattening, picking up sides and folding in, flip and palm roll to make a ball",
//             "Repeat the kneading until the folding starts losing elasticity and the ball seems firmer",
//             "Transfer to your baking sheet, placing them a few inches inches apart.",
//             "Cover and rest for 1-2 hours, or until puffy and slightly risen.",
//             "To make the egg wash, beat the remaining egg with a splash of water. When the buns are finished with the 2nd rise, gently brush each one with egg wash.",
//             "If using sesame seeds, now is the time to add to top",
//             "For Baking:",
//             "Preheat oven to 400F and place a skillet or metal baking dish on the oven floor or lower rack.",
//             "Before the dough goes in, add about 1/2 cup of water to the pan to create steam and keep the bread moist.",
//             "Bake for about 15-20 minutes or until golden brown.",
//             "Transfer to a wire rack to cool completely.",
//         ],
//         notes: [
//             "Rise times can vary.",
//             "First rise 1-3 hours, second rise 1-2 hours",
//             "* 'A warm area' can be considered your oven with the door shut and the light on",
//             "** Weigh the empty bowl first, then weigh the bowl with dough to determine how to divide"
//         ],
//         specialEquipment: [
//             "Stand mixer",
//             "Brush for butter",
//             "Bench scraper - a chef's knife or thin metal spatula if not"
//         ]
//     },
// ];

const seedDB = async seeds => {
    try {
        // clear existing data
        await Recipe.deleteMany({});

        // create data from seeds
        const res = await Recipe.insertMany(seeds);
        console.log(res);

    } catch (err) {
        console.log(err);
    }
};

seedDB(recipeSeeds.recipes)
    .then(()=> mongoose.connection.close())