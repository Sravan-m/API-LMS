const express = require('express');
const api = require('./api/index');
const app = express();
const cors = require('cors');
const { startDb } = require('./db');
const Users = require('./models/userModel');
const sah = require('./sah');
var urlencode = require('urlencode');
app.use(express.urlencoded({ extended: false }));
// const nodeApiDocGenerator = require('node-api-doc-generator')
// nodeApiDocGenerator(app,'locahost', 3000)

// Updated by siva sankar
// let csvToJson = require('convert-csv-to-json');

// const routes = require('./routes');

app.use(cors());
app.use("/api", api);

// function insertValuesToDb() {
//   console.log("Here..... Siva Sankar")
//   let fileInputName = './test-csv-data/courses.csv'; 
//   let fileOutputName = 'myOutputFile.json';

//   csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

//   let json = csvToJson.getJsonFromCsv(fileInputName);
//   for(let i=0; i<json.length;i++){
//     console.log(json[i]);
//   }
// }

startDb()
  .once('open', () => {
    app.listen(process.env.PORT || process.env.PORT_, async(req, res)=>{
      console.log('The server is running on PORT: ',process.env.PORT_);

      // insertValuesToDb();

      var adminExists=await Users.findOne({"role":"admin"})
      if(adminExists==null){
        let admin={email:"admin@network.net",role:"admin"}
      	admin['password'] = sah.saltHashPassword("admin")
        Users(admin).save()

      }
    });
  });

  // to run --> nodemon -r dotenv/config app.js
module.exports = app;
