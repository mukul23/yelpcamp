var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

// models
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true } );
app.use(flash());
// Passport Configuration
app.use(require("express-session")({
    secret:"Hello World",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// passing current suser name

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});




//connect mongoose to database






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


app.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});




app.post("/campgrounds", isLoggedIn,function(req,res){
   // get data from form and add to camp array 
     var name = req.body.name;
     var image = req.body.image;
     var desc =  req.body.description;
      var author = {
         id: req.user._id,
         username: req.user.username
     }
     var newCampground = {name: name, image : image, description: desc, author:author};
    
     
     Campground.create(newCampground, function(err,newlyCreated){
         if(err){
             console.log(err);
         }else{
             res.redirect("/campgrounds");
         }
     })
     
     
   
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


// -------------COMMENTS REST---------
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});


app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})




// /////////////////////////////////
// auth routes
///////////////////////////////////

//show register
app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser , req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("register");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/campgrounds");
            })
        }
    })
});


// show login form
app.get("/login", function(req,res){
    res.render("login", {message: req.flash("error")});
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),  function(req,res){
    // empty callback no need
});


// logout
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
}


// listen for port
app.listen(3000,function(){
    console.log("Yelpcamp has started!!!!");
})