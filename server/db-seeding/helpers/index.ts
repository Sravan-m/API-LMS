const csvjson = require('csvjson');
const readFile = require('fs').readFile;

export const csv2json = (csvfile: string) => {
    return readFile(csvfile, 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err); 
            // Do something to handle the error or just throw it
            throw new Error(err);
        }
        return csvjson.toObject(fileContent);
    });
} 