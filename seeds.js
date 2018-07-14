var mongoose = require("mongoose");
var Campground = require("./models/campground");

var Comment = require("./models/comment");







var data = [
    {
        name: "Cloud Rest",
        image:"https://www.yellowstonenationalparklodges.com/content/uploads/2017/04/madison-campground-1024x768.jpg",
        description: "blah blah blah"
    },
    
    {
        name: "Cat Rest",
        image:"http://www.clearwatervalley.com/uploads/pics/IMG_1516.JPG",
        description:"blah blah blah"
    },
    
    {
        name:"Mountains Ice",
        image:"https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5373454.jpg",
        description:"blah blah blah"
    }
    
    ]



function seedDB(){
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("removed all camps!!");
        //add a few camps
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text:"This place is great!",
                            author:"Homer"
                        }, function(err,comment){
                            if(err){
                                console.log("Some error happened!!!!!!!");
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!!")
                            }
                            
                        })
                }
            })
        })
        
    }
});
}

module.exports = seedDB;


