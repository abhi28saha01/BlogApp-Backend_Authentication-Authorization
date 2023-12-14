const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true,
    },
    email : {
        type : String,
        required : true,
        unique: true,
    },
    token : {
        type : String,
        default : undefined
    },
    posts : [{
        type : String
    }],
    likes : [{
        type : String
    }],
    comments : [{
        type : String
    }],
    password : {
        type : String,
        required : true,
    },
    resetPasswordExpires: {
        type: Date,
    },
});

module.exports = mongoose.model('User',userSchema);