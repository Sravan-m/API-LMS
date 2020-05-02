const mongo = require('mongoose');

var notificationsSchema = new mongo.Schema({
	email: { type : String, unique : true, required : true },
	expoToken: { type : String, required : true }
});

var NotificationSubscribers = mongo.model('NotificationSubscribers', notificationsSchema);

module.exports = NotificationSubscribers