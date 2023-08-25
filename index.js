import express from "express";
import path from "path";
import mongoose from "mongoose"; //Mongoose material
import cookieParser from "cookie-parser";

mongoose
  .connect("mongodb://localhost:27017", {
    //Mongoose material
    dbName: "WEBDATA", //Mongoose material
  })
  .then(() => console.log("Database have been connected"))
  .catch((e) => console.log(e)); //Mongoose material

const messageSchema = new mongoose.Schema({
  //Mongoose material
  name: String, //Mongoose material
  email: String, //Mongoose material
}); //Mongoose material

const Message = mongoose.model("Message", messageSchema); //Mongoose material

const app = express();

// const users = [];

//using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//use view engin of ejs
// app.set("view engine", "ejs");

app.use("/", express.static("images"));
app.use("/FAQ", express.static("images"));
app.use("/Projects", express.static("images"));
app.use("/Tos", express.static("images"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");

    const {token} = req.cookies;

    if(token){
      res.render("Signout");
    }else{
      res.render("Signup");
    }
});

app.get("/FAQ", (req, res) => {
  res.render("FAQ");
});
app.get("/Projects", (req, res) => {
  res.render("project");
});
app.get("/Tos", (req, res) => {
  res.render("TOS");
});


//start Authentication
app.post("/Signup", (req, res) => {
  res.cookie("token", "imin", {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});
app.post("/contact", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);

  Message.create({ name: req.body.name, email: req.body.email }); //Mongoose material

  res.render("Success");
  // res.redirect("/post");
});

// app.get("/users", (req, res)=>{
//     res.json({
//         users,
//     })
// })

app.listen(5500, () => {
  console.log("Server is working");
});
