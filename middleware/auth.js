const jwt = require('jsonwebtoken');
const Register = require('../src/models/models');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        // console.log(token)
        const verifyUser = jwt.verify(token, process.env.SECRET)
        console.log(verifyUser)
        // const user = await Register.findOne({_id:verifyUser._id})
        const user = await Register.findOne({"tokens.token":token})
        console.log(user)
        req.token=token;
        req.user=user;
        if (user==null){
            res.redirect("/login")
        }
        else{
        next();
        }
    } catch (error) {
        res.redirect("/login")
        // res.status(401).send(error)
    }
}

module.exports = auth;