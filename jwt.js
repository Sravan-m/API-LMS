const jwt = require('jsonwebtoken');
const fs = require('fs');
var privateKEY = fs.readFileSync('./private.key', 'utf8');
var publicKEY = fs.readFileSync('./public.key', 'utf8');

module.exports = {
    jwt, fs, privateKEY, publicKEY
}