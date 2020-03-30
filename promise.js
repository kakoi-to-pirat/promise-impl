'use strict';

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function Promise(fn) {
  let state = PENDING;
  let value = null;
  let handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result) {
    try {
      const then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject);
        return;
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
      return;
    }

    if (state === FULFILLED && isFunction(handler.onFulfilled)) {
      handler.onFulfilled(value);
    }

    if (state === REJECTED && isFunction(handler.onRejected)) {
      handler.onRejected(value);
    }
  }

  this.catch = function(onRejected) {
    return this.then(null, onRejected);
  };

  this.then = function(onFulfilled, onRejected) {
    const self = this;

    return new Promise(function(resolve, reject) {
      const res = function(result) {
        if (!isFunction(onFulfilled)) {
          return resolve(result);
        }

        try {
          return resolve(onFulfilled(result));
        } catch (ex) {
          return reject(ex);
        }
      };

      const rej = function(error) {
        if (!isFunction(onRejected)) {
          return reject(error);
        }

        try {
          return resolve(onRejected(error));
        } catch (ex) {
          return reject(ex);
        }
      };

      setTimeout(function() {
        handle({
          onFulfilled: res,
          onRejected: rej,
        });
      }, 0);
    });
  };

  doResolve(fn, resolve, reject);
}

function getThen(value) {
  if (value && value.then && isFunction(value.then)) {
    return then;
  }
  return null;
}

function doResolve(fn, onFulfilled, onRejected) {
  fn(onFulfilled, onRejected);
}

function isFunction(target) {
  return typeof target === 'function';
}

exports.Promise = Promise;
