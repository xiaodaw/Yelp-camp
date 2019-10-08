const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        //does user own the campground?
        if(foundCampground.author.id.equals(req.user._id)) {
          req.campground = foundCampground;
            next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login first");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        //does user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          req.comment = foundComment;
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login first");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("error", "Please Login First");
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
