const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(() => {console.log('Database Conection is Successful');})
    .catch((err) => {
        console.log(err);
        console,log('Database Conection is Not Successful');
    })
};