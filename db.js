const mongo = require('mongoose');
require('dotenv').config()

function startDb() {
  mongo.connect(process.env.MONGO_ATLAS_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('Mongodb successfully connected'));
  return mongo.connection
    .on('error', console.error)
    .on('disconnected', startDb);
}

module.exports = {
  startDb,
};
