const express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash 		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	seedDB	    = require("./seeds"),
	Campground  = require("./models/campground"),
	Comment     = require("./models/comment"),
	User		= require("./models/user");


const commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	authRoutes			= require("./routes/index");
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));


app.use(methodOverride("_method"));
// seedDB();
app.set("view engine", "ejs"); //this is to stop having to type .ejs every time.
app.use(flash());   // this is flash messages for users

app.locals.moment = require('moment');
//passport configuration
app.use(require("express-session")({
	secret:"Once again, Rusty wins cutest dog contest!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000, ()=>{
	console.log (" My YelpCamp Page has started");
});