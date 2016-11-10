'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extendable;

var _createExtendable = require('./util/createExtendable');

var _createExtendable2 = _interopRequireDefault(_createExtendable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extendable(Base) {
  var NAME = Base.prototype.constructor.name;
  var emptyBase = new Base();

  var exampleBase = void 0;
  if (emptyBase.add) {
    exampleBase = emptyBase.add('a');
  } else if (emptyBase.set) {
    exampleBase = emptyBase.set('a', 'b');
  } else if (emptyBase.push) {
    exampleBase = emptyBase.push('a');
  } else {
    throw new Error('extendable: `' + NAME + '` is not supported.');
  }

  var KEYS = Object.keys(exampleBase);
  var EMPTY = KEYS.reduce(function (acc, key) {
    acc[key] = emptyBase[key];
    return acc;
  }, {});

  function copy(val, update) {
    for (var _iterator = KEYS, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var key = _ref;

      val[key] = update[key];
    }

    return val;
  }

  function empty(val) {
    return Object.assign(val, EMPTY);
  }

  function ExtendableWrapper(val) {
    return this.__wrapImmutable(new Base(val));
  }

  ExtendableWrapper['is' + NAME] = function is(obj) {
    return obj && obj instanceof ExtendableWrapper;
  };

  ExtendableWrapper.prototype = (0, _createExtendable2.default)(Base, copy, empty);
  ExtendableWrapper.prototype.constructor = ExtendableWrapper;

  ExtendableWrapper.prototype.toString = function toString() {
    return 'Extendable.' + Base.prototype.toString.call(this);
  };

  return ExtendableWrapper;
}