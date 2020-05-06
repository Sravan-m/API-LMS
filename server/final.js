const express = require('express');
const api = require('./api/index');
const app = express();
const cors = require('cors');
const { startDb } = require('./db');
const Users = require('./models/userModel');
const fs = require('fs');
const sah = require('./sah');
var urlencode = require('urlencode');
const https = require('https');
const http = require('http');

const key = fs.readFileSync('/etc/ssl/lmscerts/angularapi.msitprogram.net.key');
const cert = fs.readFileSync( '/etc/ssl/lmscerts/angularapi.crt' );
const ca = fs.readFileSync( '/etc/ssl/lmscerts/angularapi-gd_bundle-g2-g1.crt' );
const options = {
  key: key,
  cert: cert,
  ca: ca
};


// Starting both http & https servers

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api", api);

startDb()
  .once('open', () => {
    app.listen(process.env.PORT || process.env.PORT_, async(req, res)=>{
      console.log('The server is running on PORT: ',process.env.PORT_);

      var adminExists=await Users.findOne({"role":"admin"})
      if(adminExists==null){
        let admin={email:"admin@network.net",role:"admin"}
        admin['password'] = sah.saltHashPassword("admin")
        Users(admin).save()

      }
      
    });
  });

var httpsServer = https.createServer(options, app).listen(8080);
var httpServer = http.createServer(app);
  // to run --> nodemon -r dotenv/config app.js
module.exports = app;
