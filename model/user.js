//model

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/LoginDB';

mongoose.connect(mongoDB, {
        useNewUrlParser: true
    })
    //connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connect Error'));

//Create Schema
var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }

});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback) {
    newUser.save(callback);
}