// Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require("./models/user");
// var seedDB = require('./seeds');

// Requiring Routes
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

// CONFIG
// mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://aayush:webdev@yelpcamp-bld5q.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// __dirname has the directory path where script lives in.
// this way we ensure even if there is problem in path 
// then it doesn't affect our connection to css file
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();	// seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// function we pass here is middleware 
// and it will be called on every route
app.use(function(req, res, next){
	// we want to pass that req.user to every single template
	// what ever we put in res.locals is available inside our template
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
	// remember that this next() must be there in every middleware
	// otherwise it will just stop at that middleware, nothing will happen next
	// next() tells to move to next middleware which generally is route handler
});

// Tell express to use the routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
// the first argument tells that each route starts with "/campgrounds"
app.use("/campgrounds/:id/comments", commentRoutes);


const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("The YelpCamp server has started! on port 3000");
});