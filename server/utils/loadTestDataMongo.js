const axios = require('axios')
const request = require('request')
const fs = require('fs')
const FormData = require('form-data');
const users = './Testusers.csv'
const courses = './Testcourses.csv'
const csv = require('csvtojson')

function createcourses(jsonelement) {
    var options = {
    'method': 'POST',
    'url': 'http://localhost:3000/api/course/create?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5ldHdvcmsubmV0IiwiaWF0IjoxNTg3MjgzNTMzfQ.WAL64e5BusQbdopbw_4AKBfudNiWsOPJ5rPeDj13uF29_Pro_Cr8s6oL-9NrLDPSYzH2NZSORbwCgk4mUI2XJw',
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Basic bXVydGh5dmVtdXJpQG1zaXRwcm9ncmFtLm5ldDpNdXJ0aHlANjU3MQ=='
    },
    formData: {
        'image': {
        'value': fs.createReadStream('/home/cihl-132/Desktop/mobile-api/lms-api/server/utils/images/course.png'),
        'options': {
            'filename': 'course.png',
            'contentType': null
        }
        },
        'file.path': './images/course.png',
        'courseID': jsonelement['courseID'],
        'courseName': jsonelement['courseName'],
        'courseDescription': jsonelement['courseDescription'],
        'courseInstructor': ""
    }
    };
    request(options, function (error, response) { 
    if (error) throw new Error(error);
    console.log(response.body);
    });
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

/*
* this code is to import users
**/
// csv()
// .fromFile(users)
// .then((jsonObj) => {
// })
// async function startUsers() {
//     const jsonArray = await csv().fromFile(users);
//     jsonArray.forEach(jsonelement => {
//         createusers(jsonelement)
//     });
// }
// startUsers()


/*
* this code is to import courses
*/
// csv()
// .fromFile(courses)
// .then((jsonObj) => {
// })
// async function startCourses() {
//     const jsonArray = await csv().fromFile(courses);
//     jsonArray.forEach(jsonelement => {
//         createcourses(jsonelement)
//         console.log(jsonelement['courseID'])
//         console.log(jsonelement['courseName'])
//         console.log(jsonelement['courseDescription'])
//     });
// }
// startCourses()