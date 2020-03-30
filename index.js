'use strict';

var fs = require('fs');
var Promise = require('./promise').Promise;

new Promise( (resolve, reject) => {
    fs.readFile('./package.json', 'utf8', function (err, res) {
        if (err) return reject(err);
        return resolve(res);
    });
})
.then( (txt) => {
    return JSON.parse(txt);
})
.then( (json) => {
    console.log('dependencies', json.dependencies);
})
.catch( (err) => {
    console.log('err', err);
});
