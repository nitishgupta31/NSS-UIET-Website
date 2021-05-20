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

// Home Page of NSS
app.get("/", (req, res) => {
  res.render("index.pug")
});

// contact section of home page saving form data
app.post('/contact', async (req, res) => {
  var myData = new Nsscontact(req.body);
  console.log(myData)
  await myData.save().then(item => {
    res.status(201).redirect("/")
  }).catch(err => {
    res.status(400).send("unable to save your response try again later");
  });
})

// rendering login page
app.get("/login", (req, res) => {
  res.render("login.pug")
});

// verifying user credentials with database credentials
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
      res.status(201).redirect("/login")
      // res.status(400).send("invalid credentials")

    }
  } catch (error) {
    res.status(201).redirect("/login")
  }
});

// Function for fetching queries from database and showin in admin panel
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

// rendering admin page 
app.get('/admin1', auth, async (req, res) => {
  await showDocument();
  res.status(200).render('admin1.pug', object);
})

// some post request handled here for updating status
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

app.post("/save/:id/seen", (req, res) => {
  console.log(req.body);
  console.log(res)
  const id = req.params.id;
  Nsscontact.findByIdAndUpdate(id, {
    status: "Seen"
  }, err => {
    if (err) return res.send(500, err);
    res.redirect("/admin1");
  });
});

app.get('/delete/:_id', function (req, res) {
  Nsscontact.findByIdAndDelete(req.params, function (err, results) {
    if (err) {
      return res.send(500, err);
    }
    else {
      res.redirect('/admin1');
    }
  });
});

// // rendering dance page
// app.get("/dance", auth, (req, res) => {
//   res.render("dance.pug")
// });


// delelting token and removing cookies for current user only
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

// deleting tokens from database to logout all users 
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

    res.redirect("/login")
  } catch (error) {
    res.status(500).send(error)
  }

});

// rendering add new admin page
app.get("/register", auth, (req, res) => {
  res.render("register.pug")
});

// Posting data of new admin to database
app.post('/register', auth,async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      var myData = new Register(req.body);

      console.log(myData)

      const token = await myData.generateAuthToken();

      // res.cookie("jwt", token, {
      //   expires: new Date(Date.now() + 30000),
      //   httpOnly: true
      // })

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

//listening on specified Port
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});