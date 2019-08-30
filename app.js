
var express=require("express"),
    methodOverride=require("method-override"),
    mongoose=require("mongoose"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    app=express();

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true});
mongoose.set('useFindAndModify',false);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
})
//INDEX
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        console.log(err);
        else
        res.render("index",{blogs:blogs});
    });
});
//NEW
app.get("/blogs/new",function(req,res){
    res.render("new");
})
//CREATE
app.post("/blogs",function(req,res){

    req.body.blog.body=req.sanitize(req.body.blog.body);
    
    var data=req.body.blog;
    Blog.create(data,function(err,blog){
        if(err)
        console.log(err);
        else
        res.redirect("/blogs");
    })
})
//SHOW
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err)
        res.redirect("/blogs");
        else
        res.render("show",{blog:found});
    });
});
//EDIT
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,fblog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("edit",{blog:fblog});    
    })
    
});
//UPDATE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs/"+ req.params.id);
    });

});

//DELETE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    });
});


app.listen(3000,function(){
    console.log("Server Has Started");
});