var express = require("express");
var passport = require("passport");
var googleStrategy = require("passport-google-oauth20").Strategy;
var facebookStrategy = require("passport-facebook").Strategy;
const User = require("./model/user");
require("dotenv").config();
let clientIdGoogle = process.env.CLIENTIDGOOGLE;
let clientSecretGoogle = process.env.CLIENTSECRETGOOGLE;
let callbackUrlGoogle = process.env.CALLBACKURLGOOGLE;
let clientIdFacebook = process.env.CLIENTIDFACEBOOK;
let clientSecretFacebook = process.env.CLIENTSECRETFACEBOOK;
let callbackUrlFacebook = process.env.CALLBACKURLFACEBOOK;


var app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.use(new googleStrategy({
    clientID: clientIdGoogle,
    clientSecret: clientSecretGoogle,
    callbackURL: callbackUrlGoogle,

}, function(accessToken, refreshToken, profile,done) {
    User.findOne({provider_id: profile.id}, function(err, user){
        if(err) throw(err);
        if(!err && user!= null) return done(null, user);

        var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: profile.given_name,
            lastname: profile.family_name,
        });
        user.save(function(err) {
            if(err) throw err;
            done(null, user);
        });
    });

}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new facebookStrategy({
    clientID: clientIdFacebook,
    clientSecret: clientSecretFacebook,
    callbackURL: callbackUrlFacebook,

}, function(accessToken, refreshToken, profile,done) {
    User.findOne({provider_id: profile.id}, function(err, user){
        if(err) throw(err);
        if(!err && user!= null) return done(null, user);

        var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: profile.displayName,
        });
        user.save(function(err) {
            if(err) throw err;
            done(null, user);
        });
    });

}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.set('view engine', 'pug');

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.send(req.session);
    });

app.post("/login/google", passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/facebook/callback", passport.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
        res.send(req.session);
    });

app.post("/login/facebook", passport.authenticate('facebook', {
    scope: 'email'}));

app.listen(4500);
