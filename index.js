const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');
require('dotenv').config();

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// create express app
const app = express();

// setup the express app
app.set('view engine', 'hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(express.urlencoded({
    'extended': false
}))

// custom middlewares
app.use(function(req,res,next){
    // declare a varianle named
    // date that is available for
    // all hbs file to access
    res.locals.date = Date();

    next(); // forward the request to the next middleware
            // or if there is no middleware,to the intended route function
})


// setup sessions
app.use(session({
    'store': new FileStore(),
    'secret':'keyboard cat',
    'resave': false,
    'saveUninitialized': true
}))

// setup flash message
app.use(flash());

// display in the hbs file
app.use(function(req,res,next){
    // transfer any success messages stored in the session
    // to the variables in hbs files
    res.locals.success_messages = req.flash("success_messages");
    next();    
})


// IMPORT IN THE ROUTES
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

async function main(){
    app.get('/', function(req,res){
                res.redirect('/landing');
            })

    app.use('/landing', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);

}
main();

// (async function(){
//     console.log("app")
//     console.log("app.get")
//     app.get('/', function(req,res){
//         console.log(res);
//         res.send("Hello World");
//     })
// })();

app.listen(3000,function(req,res){
    console.log("Server started");
})