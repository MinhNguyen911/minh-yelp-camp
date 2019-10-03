const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
// INDEX
router.get("/",async (req,res)=>{
	try{
		let campgrounds = await Campground.find({});
		res.render("campgrounds/index",{campgrounds: campgrounds, currentUser: req.user});
	} catch(err){
		req.flash("error",err.message);
	}
});
// NEW
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new");
});
//CREATE
router.post("/",middleware.isLoggedIn, async function(req,res){
	try{
		let newCampground = await Campground.create(req.body.campground);
		newCampground.author.id = req.user._id;
		newCampground.author.username = req.user.username;
		newCampground.save();
		req.flash("success",`${newCampground.name} has been created!`);
		res.redirect("/campgrounds");	
	} catch(err){
		console.log(err);
	}
});
//SHOW
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
		if(err){
			req.flash("error", err.message);
		} else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
	
});
//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership,async (req,res)=>{
	try{
		let foundCampground = await Campground.findById(req.params.id);
		res.render("campgrounds/edit",{campground: foundCampground});	
	} catch(err){
		req.flash("error", err.message);
		res.redirect("/campgrounds");
	}	
});
//update
router.put("/:id", middleware.checkCampgroundOwnership, async (req,res)=>{
	try{
		let updatedCampground = await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
		req.flash("success",`${updatedCampground.name} has been updated`);
		res.redirect(`/campgrounds/${req.params.id}`);
	} catch(err){
		req.flash("error", err.message);
	}
	
});
//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership,async (req,res)=>{
	try{
		let removedCampground = await Campground.findByIdAndRemove(req.params.id);
		await Comment.deleteMany({_id: { $in: removedCampground.comments } }); 
		req.flash("success",`${removedCampground.name} campground has been succesfully removed.`);
		res.redirect("/campgrounds");
	} catch(err){
		req.flash("error", err.message);
		res.redirect("/campgrounds");
	}
	
});

module.exports = router;
