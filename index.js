const mongoose = require('mongoose');
const chalk = require('chalk')
const path = require('path')

/* START: Express set up */
const express = require('express')
const app = express()
const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})) // remove if not using form

/* local set up */
const mURL = 'mongodb://localhost:27017/'
const mDB = 'recipe'
const mOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }


const connect =  async () => {
    try {
        await mongoose.connect(mURL + mDB, mOptions);
        console.log(chalk.bgGreen("Mongo Connection Open"));
    } catch (e) {
        console.log(chalk.bgRed.yellowBright(`Mongo Connection Error: ${e.message}`));
        console.log(e);
    }
};

connect();

/* END: Mongoose set up */

// test setup
app.get('/', (req, res)=> {
    res.send('Hello World!')
})

app.listen(port, ()=>console.log(chalk.greenBright(`Listening on http://localhost:${port}`)))