//all middleware goes here
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = async (req,res,next)=>{
	try{
		if(req.isAuthenticated()){
			let foundCampground	= await Campground.findById(req.params.id);
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");
			}
		} else{
			req.flash("error","You need to be logged in to do that");
			res.redirect("back");
		}
	} catch(err){
		req.flash("error","Could not find that campground!");
		res.redirect("back");
	}	
};
middlewareObj.checkCommentOwnership = async (req,res,next) =>{
	try{
		if(req.isAuthenticated()){
			let foundComment = await Comment.findById(req.params.comment_id);
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");
			}
		} else{
			req.flash("error","You need to be logged in to do that");
			res.redirect("back");
		}
	} catch(err){
		res.redirect("back");
	}
};
middlewareObj.isLoggedIn = (req,res,next) =>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
};
module.exports=middlewareObj;