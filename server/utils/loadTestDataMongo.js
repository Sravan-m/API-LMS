const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data');
const csvFilePath = './Testusers.csv'
const csv = require('csvtojson')

async function course() {
    const formData = new FormData();
    formData.append('file', fs.createReadStream('./images/democourse.png'));
    const res = await axios.post('http://localhost:3000/api/course/create?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5ldHdvcmsubmV0IiwiaWF0IjoxNTg3MjgzNTMzfQ.WAL64e5BusQbdopbw_4AKBfudNiWsOPJ5rPeDj13uF29_Pro_Cr8s6oL-9NrLDPSYzH2NZSORbwCgk4mUI2XJw', 
    formData, 
    {
        headers: formData.getHeaders(),
        body : {
            "courseID": "Demo-1id",
            "courseName":"Demo-1",
            "courseDescription":"Demo-1 description",
            "courseInstructor":[]
        }
    }
    );
}

function createusers(jsonelement) {
    axios
    .post('http://localhost:3000/api/registration/register', jsonelement)
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        // console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
}
course()
// createcourses()
// csv()
// .fromFile(csvFilePath)
// .then((jsonObj) => {
// 	// console.log(jsonObj);
// })

// Async / await usage
// async function start() {
//     const jsonArray = await csv().fromFile(csvFilePath);
//     // console.log(jsonArray);
//     jsonArray.forEach(jsonelement => {
//         createusers(jsonelement)
//     });
// }
// start()