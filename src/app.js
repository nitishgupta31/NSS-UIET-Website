require("dotenv").config();
const express = require('express');
const app = express();
require('./db/conn');
const Register = require('./models/models');
const Nsscontact = require('./models/contactmodel');
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require("../middleware/auth")
// const login = require('../Secure-Registration-system/src/app');
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

app.post('/contact', async (req, res) => {
  var myData = new Nsscontact(req.body);
  console.log(myData)
  await myData.save().then(item => {
    res.status(201).redirect("/")
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
app.get('/admin1', auth, async (req, res) => {
  await showDocument();
  res.status(200).render('admin1.pug', object);
})
app.get("/dance", auth, (req, res) => {
  res.render("dance.pug")
});
app.get("/login", (req, res) => {
  res.render("login.pug")
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email })
    const isMatch = await bcrypt.compare(password, useremail.password)

    const token = await useremail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000000),
      httpOnly: true,
      //secure: true
    })

    if (isMatch) {
      res.status(201).redirect("/admin1")
    }
    else {
      res.status(400).send("invalid credentials")

    }
  } catch (error) {
    res.status(400).send("invalid credentials")
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.user)
    try {
      req.user.tokens = req.user.tokens.filter((currentElement) => {
        return currentElement.token !== req.token
      })

    } catch (error) {
      console.log(error)
    }

    res.clearCookie('jwt');
    await req.user.save();

    res.redirect("/login")
  } catch (error) {
    res.status(500).send(error)
  }

});
app.get("/logoutall", auth, async (req, res) => {
  try {
    console.log(req.user)
    try {
      req.user.tokens = []
    } catch (error) {
      console.log(error)
    }

    res.clearCookie('jwt');
    await req.user.save();

    res.render("login.pug")
  } catch (error) {
    res.status(500).send(error)
  }

});
app.get("/register", auth, (req, res) => {
  res.render("register.pug")
});

app.post('/register', async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      var myData = new Register(req.body);

      console.log(myData)

      const token = await myData.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true
      })

      await myData.save()
      res.status(201).redirect("/admin1");
    }
    else {
      res.send("Passwords Donot Match");
    }
  } catch (error) {
    res.status(400).send("unable to save to database");
  }
})

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});