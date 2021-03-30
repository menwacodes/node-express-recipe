// prefix /recipes/welcome

const express = require('express');
const router = express.Router({mergeParams: true});

const User = require('../models/user');

// show registration form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// create user
router.post('/register', async (req, res) => {
    try {
        const {username, password, email, name} = req.body;
        const newUser = await User({username, email, name});
        const registeredUser = await User.register(newUser, password);
        req.flash('success', 'Successfully Registered')
        res.redirect('/recipes')

    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/recipes/welcome/register');
    }
});

module.exports = router;