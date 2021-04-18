const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

registerSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this.id.toString() }, process.env.SECRET)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token

    } catch (error) {
        console.log(error)
    }
}

registerSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            this.confirmPassword = await bcrypt.hash(this.password, 10);
        }
        catch (error) {
            console.log(error)
        }
    }
    next();
})

const Register = new mongoose.model('Register', registerSchema);
module.exports = Register;