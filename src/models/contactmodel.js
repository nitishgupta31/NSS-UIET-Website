const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    concern: String,
    status: String
  });

const Nsscontact = new mongoose.model('nsscontact', contactSchema);
module.exports = Nsscontact;