var express = require('express');
var router = express.Router();
var User = require('../model/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const { check, validationResult } = require('express-validator')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/login', function(req, res, next) {
    res.render('login')
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: false
}), function(req, res) {
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserByName(username, function(err, user) {
        if (err) throw error
        if (!user) {
            //ไม่พบผู้ใช้ในระบบ
            return done(null, false)
        } else {
            //พบผู้ใช้งาน
            User.comparePassword(password, user.password, function(err, isMatch) {
                callback(null, isMatch);
            });
            //if (isMatch)
        }
    });
}));
// router.post('/register', (req, res) => {
//     //var { name, email, password } = req.body

//     //console.log(name, email, password);

//     // console.log(req.body.name);
//     // console.log(req.body.email);
//     // console.log(req.body.password);
// });

router.post('/register', [
    check('name', 'กรุณากรอกชื่อใหม่อีกครั้งค่ะ').not().isEmpty(),
    check('email', 'กรุณากรอกอีเมลใหม่อีกครั้งค่ะ').isEmail(),
    check('password', 'กรุณากรอก password ใหม่อีกครั้งค่ะ').not().isEmpty()

], (req, res) => {
    const result = validationResult(req); // [error]
    var errors = result.errors;

    //ไม่ใช่ค่าว่าง
    if (!result.isEmpty()) { //[] -> [error]
        //return error to view
        res.render('register', {
            errors: errors
        })
    } else { //[]
        //insert data
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var newUser = new User({
            name: name,
            email: email,
            password: password
        });
        User.createUser(newUser, function(err, user) {
            if (err) throw err
        });
        res.location('/')
        res.redirect('/')
    }
});

module.exports = router;