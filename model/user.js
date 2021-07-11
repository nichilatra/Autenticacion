require("dotenv").config();
const mongoose = require('mongoose');
let userDb = process.env.USERDB;
let passwordDb = process.env.PASSWORDDB;
let dbNameDb = process.env.DBNAMEDB;

const uri = `mongodb+srv://${userDb}:${passwordDb}@cluster0.zjm0a.mongodb.net/${dbNameDb}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
console.log("Connected to the database");

var userSchema = mongoose.Schema({
    name: String,
    provider: String,
    provider_id: { type: String, unique: true},
    apellido: String,
    email: String,
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);