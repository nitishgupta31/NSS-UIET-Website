const mongoose = require("mongoose")

//connecting with mongodb named todo
mongoose.connect( process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false, 'useCreateIndex': true })
    .then(() => console.log("connection succesfull"))
    .catch(() => console.log("error in connecting database"));

