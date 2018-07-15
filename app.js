var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// models
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
seedDB();










//connect mongoose to database
mongoose.connect("mongodb://localhost:27017/yelp_camp");





app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
// array of camps



// ---------------------------------------------------



app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    //   res.render("campgrounds", {campgrounds:campgrounds});
    
    // get all campgrounds and render
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
    
});


app.post("/campgrounds", function(req,res){
   // get data from form and add to camp array 
     var name = req.body.name;
     var image = req.body.image;
     var desc =  req.body.description;
     var newCampground = {name: name, image : image, description: desc};
     
     Campground.create(newCampground, function(err,newlyCreated){
         if(err){
             console.log(err);
         }else{
             res.redirect("/campgrounds");
         }
     })
     
     
   
});


app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});



// show route
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});


// --------------------------------------COMMENTS REST---------
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});


app.post("/campgrounds/:id/comments", function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})






// listen for port
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server has started!!!!!!!");
});