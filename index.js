var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodoverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var blog = mongoose.model("Blog",blogSchema);

// blog.create({
//     title: "Test Blog",
//     image: "http://si.wsj.net/public/resources/images/WW-AA663A_SANDB_M_20150925152829.jpg",
//     body: "Hello from the blog post"
// });

app.get("/blogs",function(req,res){
    // res.send("Hellow from the Index page");
    // res.render("index");
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
        
    })
});

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});
//POSt Route
app.post("/blogs",function(req,res){
    blog.create(req.body.blog, function(err,newblog){
        if (err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
});

//SHOW Route
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundblog});
        }
    })
});

//Edit Route
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if (err){
            res.redirect("/blog");
        }else{
            res.render("edit",{blog:foundblog});        
        }
    });
});

//update route

app.put("/blogs/:id",function(req,res){
    //update route
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
    if (err){
        res.redirect("/blogs");
    }else
    {
        res.redirect("/blogs/"+req.params.id);
    }
    })

})


//destroy route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if (err){
            res.redirect("/blogs");
        }
        res.redirect("/blogs");  
    })
});

app.listen(process.env.PORT, process.env.IP,function(req,res){
    console.log("Blog App Server has started");
});
