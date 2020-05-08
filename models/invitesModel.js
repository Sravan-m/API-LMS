const mongo = require('mongoose');

var inviteSchema = new mongo.Schema({
    userID: String,
    email: String,
    type: String,
    status: String,
});

Invites = mongo.model('Invites', inviteSchema);

module.exports = Invites;