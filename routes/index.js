var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const middleware = require("../middleware");
router.get("/", (req,res)=>{
	res.render("landing");
});

// auth routes

//show register form
router.get("/register",(req,res)=>{
	res.render("register");
});
//handle sign-up logic
router.post("/register",async (req,res)=>{
	try{
		let newUser = new User({username: req.body.username});
		let user = await User.register(newUser,req.body.password);
		passport.authenticate("local")(req,res, ()=>{
			req.flash("success", `Welcome to YelpCamp, ${user.username}`);
			res.redirect("/campgrounds");
		});
	} catch(err){
		req.flash("error", err.message);
		return res.redirect("/register");
	}
});
//show login form
router.get("/login", (req,res)=>{
	res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req,res)=>{
		
});
//logout
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});


module.exports = router;
