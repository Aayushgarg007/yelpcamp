var express = require('express');
var router = express.Router();	// creating new instance of express router
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// When no user is logged in then req.user is undefind
// when user is logged in then passport will create req.user
// and put the user data, username & id, in req.user


// root route
router.get("/", function(req, res){
	res.render("landing");
});

// show register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

// show login form
router.get("/login", function(req, res){
	// we have to handle flash here
	res.render("login");
});

// handle login
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});


module.exports = router;