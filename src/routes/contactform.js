const router = require('express').Router();
const Nsscontact = require('../models/contactmodel');

router.route('/').post( async (req, res) => {
    var myData = new Nsscontact(req.body);
    console.log(myData)
    if (!req.body.email || !req.body.concern || !req.body.phone || !req.body.name) {
      res.status(200).render("index.pug", { 'err': "Please try again" })
    } else {
      await myData.save().then(item => {
        res.status(200).render("index.pug", { 'sucessed': "Thanks for sending your Query" })
      }).catch(err => {
        res.status(400).send("unable to save your response try again later");
      });
    }
  })
  
  router.route('/').get((req, res) => {
    res.redirect("/#contact");
  });

  module.exports=router;