var Campground = require('../models/campground');
var Comment = require('../models/comment');

// All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
	// is user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// does user own campground?
				// foundCampground.author.id  --> mongoose object
				// req.user._id  -->  string
				// we cannot compare them using == or ===
				// so for this purpose mongoose gives us a method
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
		// this will take the user back where they came from
	}
	
	// otherwise we will also redirect
	// if not, redirect
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does user own comment?
				// foundCampground.author.id  --> mongoose object
				// req.user._id  -->  string
				// we cannot compare them using == or ===
				// so for this purpose mongoose gives us a method
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
		// this will take the user back where they came from
	}
	
	// otherwise we will also redirect
	// if not, redirect
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	// error is passed as a key 
	// to determine the msg should be green or red
	// flash doesn't do anything on this page
	// it will show msg on next page
	// so we do it before we redirect
	res.redirect("/login");
}

module.exports = middlewareObj;