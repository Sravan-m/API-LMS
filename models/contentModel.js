const mongo = require('mongoose');

var ContentSchema = new mongo.Schema({
    courseInstanceID: String,
    contentJSON: {}
})

content = mongo.model('Content', ContentSchema);

module.exports = content;