var express = require('express');
var router = express.Router({mergeParams: true});	// creating new instance of express router
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// here the req.params.id is null as it is not making through comment routes 
// means its not found here
// to solve this problem we have to pass an object in express.Router({mergeParams :true})
// this will merge params from campground and comments together
// so that inside comment routes we are able to access :id that we defined


// Comments New
router.get('/new', middleware.isLoggedIn, function(req, res){
	// find campgrmiddleware.ound by id
	Campground.findById(req.params.id, function(err, campground){
		if (err || !campground) {
			console.err(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments Create
router.post('/', middleware.isLoggedIn, function(req, res){
	// lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.err(err);
			res.redirect("/campgrounds");
		} else {
			// create new comment
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// console.log(comment);
					// redirect campground show page
					req.flash("success", "Successfully added Comment");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
			
		}
	});
});

// Comments edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground) {
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
		
});

// Comments update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Comments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	// findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;