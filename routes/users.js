// prefix /recipes/welcome

const express = require('express');
const router = express.Router({mergeParams: true});

const User = require('../models/user');
const passport = require("passport");

// show registration form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// create user
router.post('/register', async (req, res, next) => {
    try {
        const {username, password, email, name} = req.body;
        const newUser = await User({username, email, name});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, err => {if (err) return next(err)})

        req.flash('success', 'Successfully Registered');
        res.redirect('/recipes');

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/recipes/welcome/register');
    }
});

// login user form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// log the user in
router.post('/login',
    passport.authenticate(
        'local',
        {failureFlash: true, failureRedirect: '/recipes/welcome/login'}),
    (req, res) => {
        // user authed if here
        req.flash('success', 'Welcome Back');
        res.redirect('/recipes');
    });

// log the user out
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Succesfully Logged Out, come back soon')
    res.redirect('/recipes')
})

module.exports = router;