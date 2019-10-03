const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
// NEW COMMENT ROUTE
router.get("/new",middleware.isLoggedIn,async (req,res)=>{
	try{
		let campground = await Campground.findById(req.params.id);
		res.render("comments/new",{campground: campground});
	} catch(err){
		req.flash("error","Can't find that campground");
	}
	
});
// CREATE COMMENT ROUTE
router.post("/",middleware.isLoggedIn,async function(req,res){
	try{
		let foundCampground= await Campground.findById(req.params.id);
		let newComment = await Comment.create(req.body.comment);
		// add username and id to comment
		newComment.author.id = req.user._id;
		newComment.author.username = req.user.username;
		newComment.save();
		foundCampground.comments.push(newComment);
		foundCampground.save();
		req.flash("success",`New comment successfully added by ${req.user.username}`);
		res.redirect(`/campgrounds/${foundCampground._id}`);
	} catch(err){
		req.flash("error", err.message);
	}	
});
//edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req,res)=>{
	try{
		let foundComment = await Comment.findById(req.params.comment_id);
		res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});  //req.params.id refer to the campground id, not comment id, see app.js
	} catch(err){
		req.flash("error", err.message);
	}
});
//update route
router.put("/:comment_id", middleware.checkCommentOwnership,async (req,res)=>{
	try{
		await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
		res.redirect(`/campgrounds/${req.params.id}`);
	} catch(err){
		req.flash("error", err.message);
		res.redirect("back");
	}
});
//delete route
router.delete('/:comment_id', middleware.checkCommentOwnership,async (req,res)=>{
	try{
		await Comment.findByIdAndRemove(req.params.comment_id);
		req.flash("success","That comment has been successfully deleted");
		res.redirect(`/campgrounds/${req.params.id}`);
	} catch(err){
		req.flash("error", err.message);
		res.redirect('back');
	}
});

module.exports = router;