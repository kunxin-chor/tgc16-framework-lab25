const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// import in the user model
const { User } = require('../models');

const { createRegistrationForm, bootstrapField, createLoginForm} = require('../forms');

router.get('/register', (req,res)=>{
    // display the registratio form
    const registerForm = createRegistrationForm();
    res.render('users/register',{
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', async (req,res)=>{
    const registerForm = createRegistrationForm();
    registerForm.handle(req,{
        'success':async function(form){
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await user.save();
            req.flash("success_messages", "You have registered successfully");
            res.redirect('/');
        },
        'error': function(form) {
            // display validation errors to user
            res.render('users/register',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', (req,res)=>{
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'success': async function(form){
            // 1. check that the email address exists in the users table
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            })

            if (!user) {
                req.flash('error_messages', "Sorry your login details is wrong")
                res.redirect('/users/login')
            } else {
                    // 2. if the user exists, then check if the password is correct
                if (user.get('password') === getHashedPassword(form.data.password)) {
                    
                    // store the user info in the session
                    req.session.user = {
                        'id': user.get('id'),
                        'username': user.get('username'),
                        'email': user.get('email')
                    }

                    req.flash('success_messages', "Successfully logged in");
                    res.redirect('/landing');

                } else {
                    req.flash('error_messages', "Sorry yourlogin details is incorrect")
                    res.redirect('/users/login')
                }
            }
        },
        'error': function(form) {
            res.render('users/login',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', async (req,res)=>{
    if (!req.session.user) {
        req.flash('error_messages', "Please login to see the page");
        res.redirect('/users/login');
    } else {
        let user = await User.where({
            'id': req.session.user.id
        }).fetch({
            'required': true
        })

        res.render('users/profile',{
            'user': user.toJSON()
        })
    }
})

router.get('/logout', (req,res) => {
    req.session.user = null;
    req.flash('success_messages', "Goodbye and see you again");
    res.redirect('/users/login');
})

module.exports = router;