const router = require('express').Router();
const Register = require('../models/models');
const bcrypt = require('bcryptjs');

router.route('/').get((req, res) => {
    res.render("login.pug")
  });

  router.route('/').post( async (req, res) => {
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
        res.status(200).render("login.pug", { 'err': "Invalid Credentials" ,"email": req.body.email})
        // res.status(201).redirect("/login")
        // res.status(400).send("invalid credentials")
  
      }
    } catch (error) {
      res.status(200).render("login.pug", { 'err': "Invalid Credentials" ,"email": req.body.email})
      // res.status(201).redirect("/login")
    }
  });
  
 module.exports = router;