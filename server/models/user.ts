const mongo = require('mongoose');
const Schema = mongo.Schema;
 
// create a schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }
}, { collection : 'Users' });
 
const User = mongo.model('User', userSchema, 'Users');
 
module.exports = User;