var express = require('express');
var router = express.Router();	// creating new instance of express router
var Campground = require('../models/campground');
var middleware = require('../middleware');
// here I have require the middleware directory
// if u require a directory not a file then
// it will automatically require the contents of index.js
// that is supposed to be the main file


// INDEX route - show all campground
router.get("/", function(req, res){
	// get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

// here we have another route with same route name 
// but this is for post request so this is considered as different routes
// there is a convention called 'REST' for routes, which is used here
// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds DB
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, image:image, description:description, author:author, price:price};

	// create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			// redirect back to campgrounds page
			// default to redirect is GET request
			// console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	})
});

// this is also 'REST' convention
// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res){
	// find the campground with provided ID
	// Campground.findById(id, callback function);
	// this function is used to find data in databaste using the id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campgroundnot found");
			res.redirect("back");
		}else{
			// console.log(foundCampground);
			// render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	})
});

// make sure "/campgrounds/new" route is declared first then "/campgrounds/:id" is declared 
// otherwise express will treat "new" as the "id"


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req ,res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
		// otherwise we will also redirect
	// if not, redirect
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			// redirect somewhere (show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;