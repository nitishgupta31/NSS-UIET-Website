require("dotenv").config();
const express = require('express');
const app = express();
require('./db/conn');
const Register = require('./models/models');
const Nsscontact = require('./models/contactmodel');
const path = require("path");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files 
app.use(express.urlencoded({ extended: true })) //To extract the data from the website to the app.js file

// app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css'))) 
// app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js'))) 
// app.use('/jq', express.static(path.join(__dirname, '../node_modules/jquery/dist'))) 

app.use(cookieParser())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, '../views')) // Set the views directory

app.get("/", (req, res) => {
  res.render("index.pug")
});

app.post('/contact', (req, res) => {
  var myData = new Nsscontact(req.body);
  console.log(myData)
  myData.save().then(item => {
    res.send("Response Submitted");
  }).catch(err => {
    res.status(400).send("unable to save your response try again later");
  });
})

const showDocument = async () => {
  try {
    const collections = await Nsscontact.find({})  //returning BSON 
    object = { "c": collections }
    if (collections[0] == undefined) {
      object = { "data": collections, "message": "Nothing to show!" }

    }
    else {
      object = { "data": collections, "message": "Contact Queries" }
    }
  } catch (error) {
    console.log(error)
  }

}

app.post("/save/:id/pending", (req, res) => {
  console.log(req.body);
  console.log(res)
  const id = req.params.id;
  Nsscontact.findByIdAndUpdate(id, {
    status: "Pending"
  }, err => {
    if (err) return res.send(500, err);
    res.redirect("/admin1");
  });
});
app.post("/save/:id/resolved", (req, res) => {
  console.log(req.body);
  console.log(res)
  const id = req.params.id;
  Nsscontact.findByIdAndUpdate(id, {
    status: "Resolved"
  }, err => {
    if (err) return res.send(500, err);
    res.redirect("/admin1");
  });
});
app.get('/admin1' , async (req, res) => {
  await showDocument();
  res.status(200).render('admin1.pug', object);
})
app.get("/login", (req, res) => {
  res.render("login.pug")
});

app.get("/register",auth, (req, res) => {
  res.render("register.pug")
});



app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});