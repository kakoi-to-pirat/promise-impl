/* eslint-env mocha */
'use strict';

var Promise = require('../promise').Promise;
var assert = require('assert');

var fs = require('fs');

describe('Promise', function() {
  it('Should resolve', () => {
    const resolvingPromise = new Promise(resolve => {
      resolve('promise resolved');
    });

    return resolvingPromise.then(result => {
      assert.equal(result, 'promise resolved');
    });
  });

  it('Should reject', () => {
    const rejectedPromise = new Promise((resolve, reject) => {
        reject('promise rejected');
    });

    return rejectedPromise.catch(result => {
      assert.equal(result, 'promise rejected');
    });
  });

  it('Should then result', () => {
    new Promise(resolve => {
      fs.readFile('data.json', 'utf8', function(err, res) {
        if (err) return reject(err);
        return resolve(res);
      });
    })
      .then(txt => {
        return JSON.parse(txt);
      })
      .then(json => {
        assert.equal(json.data, "data { test: 'ok' }");
      });
  });
});
