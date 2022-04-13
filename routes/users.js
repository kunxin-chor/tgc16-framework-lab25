const express = require('express');
const router = express.Router();

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
                'password': form.data.password,
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
                req.flash('error_messages', "Sorry the email is not found")
                req.redirect('/users/login')
            } else {
                    // 2. if the user exists, then check if the password is correct
                if (user.get('password') === form.data.password) {
                    
                    // store the user info in the session
                    req.session.user = {
                        'id': user.get('id'),
                        'username': user.get('username'),
                        'email': user.get('email')
                    }

                    req.flash('success_messages', "Successfully logged in");
                    res.redirect('/landing');

                } else {
                    req.flash('error_messages', "Sorry your password is incorrect")
                    req.redirect('/users/login')
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

module.exports = router;