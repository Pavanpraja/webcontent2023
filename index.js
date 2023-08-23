import express from 'express';
import path from 'path';

const app = express();

const users = [];

//using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

//use view engin of ejs
// app.set("view engine", "ejs");

app.use("/",express.static('images'));
app.use("/FAQ",express.static('images'));
app.use("/Projects",express.static('images'));
app.use("/Tos",express.static('images'));

app.set("view engine", "html");

app.get("/", (req, res)=>{
    res.render("index.html");
})
app.get("/FAQ", (req, res)=>{
    res.render("FAQ.html");
})
app.get("/Projects", (req, res)=>{
    res.render("project.html");
})
app.get("/Tos", (req, res)=>{
    res.render("TOS.html");
})

app.post("/contact", (req, res)=>{
    console.log(req.body.name);
    console.log(req.body.email);

    users.push({username:req.body.name, email:req.body.email});
    res.send("Message send successfully");
    // res.redirect("/post");
});

app.get("/users", (req, res)=>{
    res.json({
        users,
    })
})

app.listen(5500, ()=>{
    console.log('Server is working');
})