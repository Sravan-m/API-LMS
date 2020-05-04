const mongo = require('mongoose');

var userSchema = new mongo.Schema({
	firstName: { type : String, required : true },
	lastName: { type : String, required : true },
	userID: { type : String, required : true },
	email: { type : String, unique : true, required : true },
	password: {
		salt: { type : String, required : true },
		hash: { type : String, required : true }
	},
	phoneNo: { type : String, required : true },
	dateOfBirth: { type : Date, required : true },
	gender: { type : String, required : true },
	image: String,
	resetToken: String,
 	role: { type : String, required : true }
});

var Users = mongo.model('Users', userSchema);

module.exports =Users 