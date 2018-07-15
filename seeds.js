var mongoose = require("mongoose");
var Campground = require("./models/campground");

var Comment = require("./models/comment");







var data = [
    {
        name: "Cloud Rest",
        image:"https://www.yellowstonenationalparklodges.com/content/uploads/2017/04/madison-campground-1024x768.jpg",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    
    {
        name: "Cat Rest",
        image:"http://www.clearwatervalley.com/uploads/pics/IMG_1516.JPG",
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    
    {
        name:"Mountains Ice",
        image:"https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5373454.jpg",
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
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


