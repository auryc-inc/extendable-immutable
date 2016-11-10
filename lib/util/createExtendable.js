'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createExtendable;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unwrappedMethods = ['constructor', 'get', 'getIn', 'first', 'last', 'reduce', 'reduceRight', 'find', 'findLast', 'findEntry', 'findLastEntry', 'max', 'maxBy', 'min', 'minBy', 'clear' // Important! We're manually overriding this method
];

function createExtendable(base, copy, empty) {
  (0, _invariant2.default)(typeof copy === 'function', name + ': `copy` is expected to be a function.');
  (0, _invariant2.default)(typeof empty === 'function', name + ': `empty` is expected to be a function.');

  var constructor = base.prototype.constructor;
  var name = constructor.name;
  var proto = Object.create(base.prototype);

  // Overrides the original clear method that returns an empty object
  proto.clear = function clear() {
    return this.__wrapImmutable({});
  };

  // Create a list of keys and values that hold the empty instances
  var emptyKeys = [];
  var emptyValues = [];

  // A method for wrapping an immutable object, with reference equality for empty instances
  proto.__wrapImmutable = function __wrapImmutable(val) {
    var forceCreation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var prototype = Object.getPrototypeOf(this);
    var constructor = prototype.constructor;


    if (!val.size && !val.__ownerID && !forceCreation) {
      var emptyIndex = emptyKeys.indexOf(prototype);
      if (emptyIndex > -1) {
        return emptyValues[emptyIndex];
      }

      // Create empty instance and store it
      var emptyInstance = empty(Object.create(prototype));
      emptyValues[emptyKeys.length] = emptyInstance;
      emptyKeys.push(prototype);

      return emptyInstance;
    }

    return copy(Object.create(prototype), val);
  };

  // Methods which will yield a Map and have to be wrapped before returning a result
  for (var key in base.prototype) {
    if (!_lodash2.default.startsWith(key, '__') && !_lodash2.default.startsWith(key, 'to') && unwrappedMethods.indexOf(key) === -1) {
      (function () {
        var _originalMethod = base.prototype[key];

        if (typeof _originalMethod === 'function') {
          proto[key] = function wrappedMethod() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var res = _originalMethod.apply(this, args);

            if (res && typeof res === 'object' && Object.getPrototypeOf(res).constructor === constructor) {
              return this.__wrapImmutable(res);
            }

            return res;
          };
        }
      })();
    }
  }

  proto.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    } else if (!ownerID) {
      this.__ownerID = undefined;
      this.__altered = false;
      return this;
    }

    var res = this.__wrapImmutable(this, true);
    res.__ownerID = ownerID;
    return res;
  };

  return proto;
}