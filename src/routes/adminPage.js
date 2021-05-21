const router = require('express').Router();
const auth = require("../../middleware/auth")
const Nsscontact = require('../models/contactmodel');

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


router.route('/').get( auth, async (req, res) => {
    await showDocument();
    res.status(200).render('admin1.pug', object);
  })

  module.exports = router;