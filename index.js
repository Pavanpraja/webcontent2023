import express from "express";
import path from "path";
import mongoose from "mongoose"; //Mongoose material
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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

const userSche = new mongoose.Schema({
  email: String,
  password: String,
});


const Message = mongoose.model("Message", messageSchema); //Mongoose material
const userMess = mongoose.model("user", userSche);

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

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (token) {
    const decoded = jwt.verify(token, "lajfjljafjldfa");

    req.userMess = await userMess.findById(decoded._id);

    next();
  } else {
    res.redirect("/Signup");
  }
};



app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", isAuthenticated, (req, res) => {
  console.log(req.userMess);
  res.render("Signout");
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
app.get("/Signup", (req, res) => {
  res.render("Signup");
});

app.get("/register", (req, res) => {
  res.render("register");
});

//start Authentication

app.post("/register", async (req, res)=>{
  console.log(req.body);

  const {name, email, password} = req.body;

  let user = await userMess.findOne({email});

  if(user) {
    return res.redirect("/Signup");
  }


  user = await userMess.create({name, email, password, });

  const token = jwt.sign({_id:user._id}, "lajfjljafjldfa");
  console.log(token);

  res.cookie("token", token,{
    httpOnly: true,
    expires: new Date(Date.now() + 60*1000),
  });
  res.redirect("/");
});

app.post("/Signup", async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  let user = await userMess.findOne({ email });

  if (!user) {
    return res.redirect("/register");
  }

  const isMatch = user.password === password;

  if(!isMatch){
    return res.render("Signup", { message: "Incorrect password"});
  }

  // user = await userMess.create({ email, password });

  const token = jwt.sign({ _id: user._id }, "lajfjljafjldfa");
  console.log(token);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/index");
});



app.get("/Signout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.redirect("/index");
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
