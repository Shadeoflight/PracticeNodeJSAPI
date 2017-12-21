
// User data model

// Get instance of mongoose
var mongoose = require('mongoose');
// Get instance of mongoose.Schema
var Schema = mongoose.Schema;

// Initialize mongoose model and pass it with module.exports
module.exports = mongoose.model('User', new Schema({
  user_name: String,
  password: String,
  admin: Boolean
}));