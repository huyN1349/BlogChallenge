//jshint esversion:6
//Declare Express dependency
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Declare Mongoose dependency
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true});
const postSchema = new Schema({
  title: String,
  content: String,
  datePosted: Date,
})
const Post = mongoose.model("Post",postSchema);

const pageSchema = new Schema({
  title: String,
  content: String,
  datePosted: Date,
})
const Page = mongoose.model("Page", pageSchema);

// const firstPost = new Post({
//   title: "Home",
//   content:"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
//   datePosted: Date,
// });
// //firstPost.save();
//
// const aboutPost = new Page({
//   title: "About",
//   content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
//   datePosted: Date,
// });
// //aboutPost.save();
//
// const contactPost = new Page({
//   title:"Contact",
//   content:"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
//   datePosted: Date,
// });
//contactPost.save();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//var posts = [];



app.get("/", function(req,res){
  Post.find({}, function(err, foundPost){
    //console.log(foundPost[1]);
    res.render("home",{
      homeStartingContentEJS: homeStartingContent,
      postsEJS: foundPost,
    });
  })
})

app.get("/about", function(req,res){
  res.render("about", {
    aboutContentEJS: aboutContent,
  })
})

app.get("/contact", function(req,res){

  res.render("contact", {
    contactContentEJS: contactContent,
  })
})

app.get("/compose", function(req,res){
  res.render("compose");
})

app.post("/compose", function(req,res){
  const postTitle = req.body.blogTitle;
  const postContent = req.body.blogPost;
  const date = new Date();
  Post.find({title:postTitle}, function(err, foundPost){
    if (foundPost.length > 0) {
      console.log("Please try a different title.")
      res.redirect("/compose");
    } else {
      Post.create({
        title: postTitle,
        content: postContent,
        datePosted: date,
      });
      console.log("Successfully save new post.")
      res.redirect("/");
    }
  });

})

app.get("/posts/:topic", function(req,res) {
  Post.find({_id:req.params.topic}, function(err,foundPost){
    //console.log(foundPost[0].title);
    res.render("post", {
      postTitleEJS: foundPost[0].title,
      postContentEJS: foundPost[0].content,
  })
})
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started.");
});
