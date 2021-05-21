const router = require('express').Router();
const Nsscontact = require('../models/contactmodel');


//rendering home page
router.route('/').get((req, res) => {
    res.render("index.pug");
});




//Updating queries of admin page
router.route("/save/:id/pending").post((req, res) => {
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

router.route("/save/:id/resolved").post((req, res) => {
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

router.route("/save/:id/seen").post((req, res) => {
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

router.route('/delete/:_id').get(function (req, res) {
    Nsscontact.findByIdAndDelete(req.params, function (err, results) {
        if (err) {
            return res.send(500, err);
        }
        else {
            res.redirect('/admin1');
        }
    });
});



module.exports = router;