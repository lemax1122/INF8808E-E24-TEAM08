// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"qBTa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.cloneProperties = cloneProperties;
exports.default = void 0;
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// index.ts
function clone(geojson) {
  if (!geojson) {
    throw new Error("geojson is required");
  }
  switch (geojson.type) {
    case "Feature":
      return cloneFeature(geojson);
    case "FeatureCollection":
      return cloneFeatureCollection(geojson);
    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
    case "GeometryCollection":
      return cloneGeometry(geojson);
    default:
      throw new Error("unknown GeoJSON type");
  }
}
__name(clone, "clone");
function cloneFeature(geojson) {
  const cloned = {
    type: "Feature"
  };
  Object.keys(geojson).forEach(key => {
    switch (key) {
      case "type":
      case "properties":
      case "geometry":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  cloned.properties = cloneProperties(geojson.properties);
  if (geojson.geometry == null) {
    cloned.geometry = null;
  } else {
    cloned.geometry = cloneGeometry(geojson.geometry);
  }
  return cloned;
}
__name(cloneFeature, "cloneFeature");
function cloneProperties(properties) {
  const cloned = {};
  if (!properties) {
    return cloned;
  }
  Object.keys(properties).forEach(key => {
    const value = properties[key];
    if (typeof value === "object") {
      if (value === null) {
        cloned[key] = null;
      } else if (Array.isArray(value)) {
        cloned[key] = value.map(item => {
          return item;
        });
      } else {
        cloned[key] = cloneProperties(value);
      }
    } else {
      cloned[key] = value;
    }
  });
  return cloned;
}
__name(cloneProperties, "cloneProperties");
function cloneFeatureCollection(geojson) {
  const cloned = {
    type: "FeatureCollection"
  };
  Object.keys(geojson).forEach(key => {
    switch (key) {
      case "type":
      case "features":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  cloned.features = geojson.features.map(feature => {
    return cloneFeature(feature);
  });
  return cloned;
}
__name(cloneFeatureCollection, "cloneFeatureCollection");
function cloneGeometry(geometry) {
  const geom = {
    type: geometry.type
  };
  if (geometry.bbox) {
    geom.bbox = geometry.bbox;
  }
  if (geometry.type === "GeometryCollection") {
    geom.geometries = geometry.geometries.map(g => {
      return cloneGeometry(g);
    });
    return geom;
  }
  geom.coordinates = deepSlice(geometry.coordinates);
  return geom;
}
__name(cloneGeometry, "cloneGeometry");
function deepSlice(coords) {
  const cloned = coords;
  if (typeof cloned[0] !== "object") {
    return cloned.slice();
  }
  return cloned.map(coord => {
    return deepSlice(coord);
  });
}
__name(deepSlice, "deepSlice");
var turf_clone_default = clone;
exports.default = turf_clone_default;
},{}],"uTT0":[function(require,module,exports) {
'use strict';

var toStr = Object.prototype.toString;
module.exports = function isArguments(value) {
  var str = toStr.call(value);
  var isArgs = str === '[object Arguments]';
  if (!isArgs) {
    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
  }
  return isArgs;
};
},{}],"orz8":[function(require,module,exports) {
'use strict';

var keysShim;
if (!Object.keys) {
  // modified from https://github.com/es-shims/es5-shim
  var has = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var isArgs = require('./isArguments'); // eslint-disable-line global-require
  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
  var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };
  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $onmozfullscreenchange: true,
    $onmozfullscreenerror: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };
  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }
    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }
    return false;
  }();
  var equalsConstructorPrototypeIfNotBuggy = function (o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }
    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };
  keysShim = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr.call(object) === '[object Function]';
    var isArguments = isArgs(object);
    var isString = isObject && toStr.call(object) === '[object String]';
    var theKeys = [];
    if (!isObject && !isFunction && !isArguments) {
      throw new TypeError('Object.keys called on a non-object');
    }
    var skipProto = hasProtoEnumBug && isFunction;
    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }
    if (isArguments && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }
    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }
    return theKeys;
  };
}
module.exports = keysShim;
},{"./isArguments":"uTT0"}],"ywQn":[function(require,module,exports) {
'use strict';

var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : require('./implementation');
var originalKeys = Object.keys;
keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function () {
      // Safari 5.0 bug
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);
    if (!keysWorksWithArguments) {
      Object.keys = function keys(object) {
        // eslint-disable-line func-name-matching
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }
        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }
  return Object.keys || keysShim;
};
module.exports = keysShim;
},{"./isArguments":"uTT0","./implementation":"orz8"}],"bwtj":[function(require,module,exports) {
'use strict';

/** @type {import('.')} */
module.exports = Error;
},{}],"i3qc":[function(require,module,exports) {
'use strict';

/** @type {import('./eval')} */
module.exports = EvalError;
},{}],"GfHm":[function(require,module,exports) {
'use strict';

/** @type {import('./range')} */
module.exports = RangeError;
},{}],"DZEA":[function(require,module,exports) {
'use strict';

/** @type {import('./ref')} */
module.exports = ReferenceError;
},{}],"srJF":[function(require,module,exports) {
'use strict';

/** @type {import('./syntax')} */
module.exports = SyntaxError;
},{}],"uVNY":[function(require,module,exports) {
'use strict';

/** @type {import('./type')} */
module.exports = TypeError;
},{}],"u6G0":[function(require,module,exports) {
'use strict';

/** @type {import('./uri')} */
module.exports = URIError;
},{}],"jYt2":[function(require,module,exports) {
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }
  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }
  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);
  if (typeof sym === 'string') {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  }

  // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }

  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
},{}],"NS5K":[function(require,module,exports) {
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');
module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }
  if (typeof Symbol !== 'function') {
    return false;
  }
  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }
  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }
  return hasSymbolSham();
};
},{"./shams":"jYt2"}],"Hgl8":[function(require,module,exports) {
'use strict';

var test = {
  __proto__: null,
  foo: {}
};
var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
  // @ts-expect-error: TS errors on an inherited property for some reason
  return {
    __proto__: test
  }.foo === test.foo && !(test instanceof $Object);
};
},{}],"B6OE":[function(require,module,exports) {
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],"TiwC":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":"B6OE"}],"pijy":[function(require,module,exports) {
'use strict';

var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = require('function-bind');

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);
},{"function-bind":"TiwC"}],"LiLl":[function(require,module,exports) {
'use strict';

var undefined;
var $Error = require('es-errors');
var $EvalError = require('es-errors/eval');
var $RangeError = require('es-errors/range');
var $ReferenceError = require('es-errors/ref');
var $SyntaxError = require('es-errors/syntax');
var $TypeError = require('es-errors/type');
var $URIError = require('es-errors/uri');
var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};
var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
  try {
    $gOPD({}, '');
  } catch (e) {
    $gOPD = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function () {
  throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = require('has-symbols')();
var hasProto = require('has-proto')();
var getProto = Object.getPrototypeOf || (hasProto ? function (x) {
  return x.__proto__;
} // eslint-disable-line no-proto
: null);
var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
  '%AsyncFromSyncIteratorPrototype%': undefined,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
  '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
  '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': $Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': $EvalError,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
  '%JSON%': typeof JSON === 'object' ? JSON : undefined,
  '%Map%': typeof Map === 'undefined' ? undefined : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': Object,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
  '%RangeError%': $RangeError,
  '%ReferenceError%': $ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
  '%Symbol%': hasSymbols ? Symbol : undefined,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  '%URIError%': $URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};
if (getProto) {
  try {
    null.error; // eslint-disable-line no-unused-expressions
  } catch (e) {
    // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
    var errorProto = getProto(getProto(e));
    INTRINSICS['%Error.prototype%'] = errorProto;
  }
}
var doEval = function doEval(name) {
  var value;
  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  __proto__: null,
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var bind = require('function-bind');
var hasOwn = require('hasown');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }
  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }
  if (hasOwn(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }
    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }
  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};
module.exports = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }
  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }
    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';
    if (hasOwn(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }
        return void undefined;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;

        // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.
        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
},{"es-errors":"bwtj","es-errors/eval":"i3qc","es-errors/range":"GfHm","es-errors/ref":"DZEA","es-errors/syntax":"srJF","es-errors/type":"uVNY","es-errors/uri":"u6G0","has-symbols":"NS5K","has-proto":"Hgl8","function-bind":"TiwC","hasown":"pijy"}],"JcBN":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = false;
  }
}
module.exports = $defineProperty;
},{"get-intrinsic":"LiLl"}],"JuiR":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":"LiLl"}],"jPvt":[function(require,module,exports) {
'use strict';

var $defineProperty = require('es-define-property');
var $SyntaxError = require('es-errors/syntax');
var $TypeError = require('es-errors/type');
var gopd = require('gopd');

/** @type {import('.')} */
module.exports = function defineDataProperty(obj, property, value) {
  if (!obj || typeof obj !== 'object' && typeof obj !== 'function') {
    throw new $TypeError('`obj` must be an object or a function`');
  }
  if (typeof property !== 'string' && typeof property !== 'symbol') {
    throw new $TypeError('`property` must be a string or a symbol`');
  }
  if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
    throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
    throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
    throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
    throw new $TypeError('`loose`, if provided, must be a boolean');
  }
  var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
  var nonWritable = arguments.length > 4 ? arguments[4] : null;
  var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
  var loose = arguments.length > 6 ? arguments[6] : false;

  /* @type {false | TypedPropertyDescriptor<unknown>} */
  var desc = !!gopd && gopd(obj, property);
  if ($defineProperty) {
    $defineProperty(obj, property, {
      configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
      enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
      value: value,
      writable: nonWritable === null && desc ? desc.writable : !nonWritable
    });
  } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
    // must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
    obj[property] = value; // eslint-disable-line no-param-reassign
  } else {
    throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
  }
};
},{"es-define-property":"JcBN","es-errors/syntax":"srJF","es-errors/type":"uVNY","gopd":"JuiR"}],"wm0e":[function(require,module,exports) {
'use strict';

var $defineProperty = require('es-define-property');

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;

},{"es-define-property":"JcBN"}],"VxKF":[function(require,module,exports) {
'use strict';

var keys = require('object-keys');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';
var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var defineDataProperty = require('define-data-property');
var isFunction = function (fn) {
  return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};
var supportsDescriptors = require('has-property-descriptors')();
var defineProperty = function (object, name, value, predicate) {
  if (name in object) {
    if (predicate === true) {
      if (object[name] === value) {
        return;
      }
    } else if (!isFunction(predicate) || !predicate()) {
      return;
    }
  }
  if (supportsDescriptors) {
    defineDataProperty(object, name, value, true);
  } else {
    defineDataProperty(object, name, value);
  }
};
var defineProperties = function (object, map) {
  var predicates = arguments.length > 2 ? arguments[2] : {};
  var props = keys(map);
  if (hasSymbols) {
    props = concat.call(props, Object.getOwnPropertySymbols(map));
  }
  for (var i = 0; i < props.length; i += 1) {
    defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
  }
};
defineProperties.supportsDescriptors = !!supportsDescriptors;
module.exports = defineProperties;
},{"object-keys":"ywQn","define-data-property":"jPvt","has-property-descriptors":"wm0e"}],"wDN6":[function(require,module,exports) {

'use strict';

var GetIntrinsic = require('get-intrinsic');
var define = require('define-data-property');
var hasDescriptors = require('has-property-descriptors')();
var gOPD = require('gopd');
var $TypeError = require('es-errors/type');
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
  if (typeof fn !== 'function') {
    throw new $TypeError('`fn` is not a function');
  }
  if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
    throw new $TypeError('`length` must be a positive 32-bit integer');
  }
  var loose = arguments.length > 2 && !!arguments[2];
  var functionLengthIsConfigurable = true;
  var functionLengthIsWritable = true;
  if ('length' in fn && gOPD) {
    var desc = gOPD(fn, 'length');
    if (desc && !desc.configurable) {
      functionLengthIsConfigurable = false;
    }
    if (desc && !desc.writable) {
      functionLengthIsWritable = false;
    }
  }
  if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
    if (hasDescriptors) {
      define( /** @type {Parameters<define>[0]} */fn, 'length', length, true, true);
    } else {
      define( /** @type {Parameters<define>[0]} */fn, 'length', length);
    }
  }
  return fn;
};
},{"get-intrinsic":"LiLl","define-data-property":"jPvt","has-property-descriptors":"wm0e","gopd":"JuiR","es-errors/type":"uVNY"}],"y9YS":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');
var setFunctionLength = require('set-function-length');
var $TypeError = require('es-errors/type');
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
var $defineProperty = require('es-define-property');
var $max = GetIntrinsic('%Math.max%');
module.exports = function callBind(originalFunction) {
  if (typeof originalFunction !== 'function') {
    throw new $TypeError('a function is required');
  }
  var func = $reflectApply(bind, $call, arguments);
  return setFunctionLength(func, 1 + $max(0, originalFunction.length - (arguments.length - 1)), true);
};
var applyBind = function applyBind() {
  return $reflectApply(bind, $apply, arguments);
};
if ($defineProperty) {
  $defineProperty(module.exports, 'apply', {
    value: applyBind
  });
} else {
  module.exports.apply = applyBind;
}
},{"function-bind":"TiwC","get-intrinsic":"LiLl","set-function-length":"wDN6","es-errors/type":"uVNY","es-define-property":"JcBN"}],"tAiC":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBind = require('./');
var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));
module.exports = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic(name, !!allowMissing);
  if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
    return callBind(intrinsic);
  }
  return intrinsic;
};
},{"get-intrinsic":"LiLl","./":"y9YS"}],"Wie4":[function(require,module,exports) {
'use strict';

// modified from https://github.com/es-shims/es6-shim
var objectKeys = require('object-keys');
var hasSymbols = require('has-symbols/shams')();
var callBound = require('call-bind/callBound');
var toObject = Object;
var $push = callBound('Array.prototype.push');
var $propIsEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

// eslint-disable-next-line no-unused-vars
module.exports = function assign(target, source1) {
  if (target == null) {
    throw new TypeError('target must be an object');
  }
  var to = toObject(target); // step 1
  if (arguments.length === 1) {
    return to; // step 2
  }

  for (var s = 1; s < arguments.length; ++s) {
    var from = toObject(arguments[s]); // step 3.a.i

    // step 3.a.ii:
    var keys = objectKeys(from);
    var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
    if (getSymbols) {
      var syms = getSymbols(from);
      for (var j = 0; j < syms.length; ++j) {
        var key = syms[j];
        if ($propIsEnumerable(from, key)) {
          $push(keys, key);
        }
      }
    }

    // step 3.a.iii:
    for (var i = 0; i < keys.length; ++i) {
      var nextKey = keys[i];
      if ($propIsEnumerable(from, nextKey)) {
        // step 3.a.iii.2
        var propValue = from[nextKey]; // step 3.a.iii.2.a
        to[nextKey] = propValue; // step 3.a.iii.2.b
      }
    }
  }

  return to; // step 4
};
},{"object-keys":"ywQn","has-symbols/shams":"jYt2","call-bind/callBound":"tAiC"}],"YLfE":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');
var lacksProperEnumerationOrder = function () {
  if (!Object.assign) {
    return false;
  }
  /*
   * v8, specifically in node 4.x, has a bug with incorrect property enumeration order
   * note: this does not detect the bug unless there's 20 characters
   */
  var str = 'abcdefghijklmnopqrst';
  var letters = str.split('');
  var map = {};
  for (var i = 0; i < letters.length; ++i) {
    map[letters[i]] = letters[i];
  }
  var obj = Object.assign({}, map);
  var actual = '';
  for (var k in obj) {
    actual += k;
  }
  return str !== actual;
};
var assignHasPendingExceptions = function () {
  if (!Object.assign || !Object.preventExtensions) {
    return false;
  }
  /*
   * Firefox 37 still has "pending exception" logic in its Object.assign implementation,
   * which is 72% slower than our shim, and Firefox 40's native implementation.
   */
  var thrower = Object.preventExtensions({
    1: 2
  });
  try {
    Object.assign(thrower, 'xy');
  } catch (e) {
    return thrower[1] === 'y';
  }
  return false;
};
module.exports = function getPolyfill() {
  if (!Object.assign) {
    return implementation;
  }
  if (lacksProperEnumerationOrder()) {
    return implementation;
  }
  if (assignHasPendingExceptions()) {
    return implementation;
  }
  return Object.assign;
};
},{"./implementation":"Wie4"}],"B5ZE":[function(require,module,exports) {

'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');
module.exports = function shimAssign() {
  var polyfill = getPolyfill();
  define(Object, {
    assign: polyfill
  }, {
    assign: function () {
      return Object.assign !== polyfill;
    }
  });
  return polyfill;
};
},{"define-properties":"VxKF","./polyfill":"YLfE"}],"Lcxy":[function(require,module,exports) {
'use strict';

var defineProperties = require('define-properties');
var callBind = require('call-bind');
var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');
var polyfill = callBind.apply(getPolyfill());
// eslint-disable-next-line no-unused-vars
var bound = function assign(target, source1) {
  return polyfill(Object, arguments);
};
defineProperties(bound, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
module.exports = bound;
},{"define-properties":"VxKF","call-bind":"y9YS","./implementation":"Wie4","./polyfill":"YLfE","./shim":"B5ZE"}],"VCQ6":[function(require,module,exports) {
'use strict';

var functionsHaveNames = function functionsHaveNames() {
	return typeof function f() {}.name === 'string';
};

var gOPD = Object.getOwnPropertyDescriptor;
if (gOPD) {
	try {
		gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		gOPD = null;
	}
}

functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
	if (!functionsHaveNames() || !gOPD) {
		return false;
	}
	var desc = gOPD(function () {}, 'name');
	return !!desc && !!desc.configurable;
};

var $bind = Function.prototype.bind;

functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
	return functionsHaveNames() && typeof $bind === 'function' && function f() {}.bind().name !== '';
};

module.exports = functionsHaveNames;

},{}],"zPSE":[function(require,module,exports) {

'use strict';

var define = require('define-data-property');
var hasDescriptors = require('has-property-descriptors')();
var functionsHaveConfigurableNames = require('functions-have-names').functionsHaveConfigurableNames();
var $TypeError = require('es-errors/type');

/** @type {import('.')} */
module.exports = function setFunctionName(fn, name) {
  if (typeof fn !== 'function') {
    throw new $TypeError('`fn` is not a function');
  }
  var loose = arguments.length > 2 && !!arguments[2];
  if (!loose || functionsHaveConfigurableNames) {
    if (hasDescriptors) {
      define( /** @type {Parameters<define>[0]} */fn, 'name', name, true, true);
    } else {
      define( /** @type {Parameters<define>[0]} */fn, 'name', name);
    }
  }
  return fn;
};
},{"define-data-property":"jPvt","has-property-descriptors":"wm0e","functions-have-names":"VCQ6","es-errors/type":"uVNY"}],"HmkM":[function(require,module,exports) {
'use strict';

var setFunctionName = require('set-function-name');
var $TypeError = require('es-errors/type');
var $Object = Object;
module.exports = setFunctionName(function flags() {
  if (this == null || this !== $Object(this)) {
    throw new $TypeError('RegExp.prototype.flags getter called on non-object');
  }
  var result = '';
  if (this.hasIndices) {
    result += 'd';
  }
  if (this.global) {
    result += 'g';
  }
  if (this.ignoreCase) {
    result += 'i';
  }
  if (this.multiline) {
    result += 'm';
  }
  if (this.dotAll) {
    result += 's';
  }
  if (this.unicode) {
    result += 'u';
  }
  if (this.unicodeSets) {
    result += 'v';
  }
  if (this.sticky) {
    result += 'y';
  }
  return result;
}, 'get flags', true);
},{"set-function-name":"zPSE","es-errors/type":"uVNY"}],"YWiL":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');
var supportsDescriptors = require('define-properties').supportsDescriptors;
var $gOPD = Object.getOwnPropertyDescriptor;
module.exports = function getPolyfill() {
  if (supportsDescriptors && /a/mig.flags === 'gim') {
    var descriptor = $gOPD(RegExp.prototype, 'flags');
    if (descriptor && typeof descriptor.get === 'function' && typeof RegExp.prototype.dotAll === 'boolean' && typeof RegExp.prototype.hasIndices === 'boolean') {
      /* eslint getter-return: 0 */
      var calls = '';
      var o = {};
      Object.defineProperty(o, 'hasIndices', {
        get: function () {
          calls += 'd';
        }
      });
      Object.defineProperty(o, 'sticky', {
        get: function () {
          calls += 'y';
        }
      });
      if (calls === 'dy') {
        return descriptor.get;
      }
    }
  }
  return implementation;
};
},{"./implementation":"HmkM","define-properties":"VxKF"}],"Kszl":[function(require,module,exports) {
'use strict';

var supportsDescriptors = require('define-properties').supportsDescriptors;
var getPolyfill = require('./polyfill');
var gOPD = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var TypeErr = TypeError;
var getProto = Object.getPrototypeOf;
var regex = /a/;
module.exports = function shimFlags() {
  if (!supportsDescriptors || !getProto) {
    throw new TypeErr('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
  }
  var polyfill = getPolyfill();
  var proto = getProto(regex);
  var descriptor = gOPD(proto, 'flags');
  if (!descriptor || descriptor.get !== polyfill) {
    defineProperty(proto, 'flags', {
      configurable: true,
      enumerable: false,
      get: polyfill
    });
  }
  return polyfill;
};
},{"define-properties":"VxKF","./polyfill":"YWiL"}],"DbQL":[function(require,module,exports) {

'use strict';

var define = require('define-properties');
var callBind = require('call-bind');
var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');
var flagsBound = callBind(getPolyfill());
define(flagsBound, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
module.exports = flagsBound;
},{"define-properties":"VxKF","call-bind":"y9YS","./implementation":"HmkM","./polyfill":"YWiL","./shim":"Kszl"}],"KpHW":[function(require,module,exports) {
'use strict';

var hasSymbols = require('has-symbols/shams');

/** @type {import('.')} */
module.exports = function hasToStringTagShams() {
  return hasSymbols() && !!Symbol.toStringTag;
};
},{"has-symbols/shams":"jYt2"}],"ordk":[function(require,module,exports) {
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');
var $toString = callBound('Object.prototype.toString');
var isStandardArguments = function isArguments(value) {
  if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
    return false;
  }
  return $toString(value) === '[object Arguments]';
};
var isLegacyArguments = function isArguments(value) {
  if (isStandardArguments(value)) {
    return true;
  }
  return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString(value) !== '[object Array]' && $toString(value.callee) === '[object Function]';
};
var supportsStandardArguments = function () {
  return isStandardArguments(arguments);
}();
isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
},{"has-tostringtag/shams":"KpHW","call-bind/callBound":"tAiC"}],"rDCW":[function(require,module,exports) {

},{}],"d9qy":[function(require,module,exports) {
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = require('./util.inspect');
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

},{"./util.inspect":"rDCW"}],"iGu9":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var inspect = require('object-inspect');

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

},{"get-intrinsic":"LiLl","call-bind/callBound":"tAiC","object-inspect":"d9qy"}],"Omom":[function(require,module,exports) {
'use strict';

var hasOwn = require('hasown');
var channel = require('side-channel')();
var $TypeError = require('es-errors/type');
var SLOT = {
  assert: function (O, slot) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
      throw new $TypeError('`O` is not an object');
    }
    if (typeof slot !== 'string') {
      throw new $TypeError('`slot` must be a string');
    }
    channel.assert(O);
    if (!SLOT.has(O, slot)) {
      throw new $TypeError('`' + slot + '` is not present on `O`');
    }
  },
  get: function (O, slot) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
      throw new $TypeError('`O` is not an object');
    }
    if (typeof slot !== 'string') {
      throw new $TypeError('`slot` must be a string');
    }
    var slots = channel.get(O);
    return slots && slots['$' + slot];
  },
  has: function (O, slot) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
      throw new $TypeError('`O` is not an object');
    }
    if (typeof slot !== 'string') {
      throw new $TypeError('`slot` must be a string');
    }
    var slots = channel.get(O);
    return !!slots && hasOwn(slots, '$' + slot);
  },
  set: function (O, slot, V) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
      throw new $TypeError('`O` is not an object');
    }
    if (typeof slot !== 'string') {
      throw new $TypeError('`slot` must be a string');
    }
    var slots = channel.get(O);
    if (!slots) {
      slots = {};
      channel.set(O, slots);
    }
    slots['$' + slot] = V;
  }
};
if (Object.freeze) {
  Object.freeze(SLOT);
}
module.exports = SLOT;
},{"hasown":"pijy","side-channel":"iGu9","es-errors/type":"uVNY"}],"ieXR":[function(require,module,exports) {
'use strict';

var SLOT = require('internal-slot');
var $SyntaxError = SyntaxError;
var $StopIteration = typeof StopIteration === 'object' ? StopIteration : null;
module.exports = function getStopIterationIterator(origIterator) {
  if (!$StopIteration) {
    throw new $SyntaxError('this environment lacks StopIteration');
  }
  SLOT.set(origIterator, '[[Done]]', false);
  var siIterator = {
    next: function next() {
      var iterator = SLOT.get(this, '[[Iterator]]');
      var done = SLOT.get(iterator, '[[Done]]');
      try {
        return {
          done: done,
          value: done ? void undefined : iterator.next()
        };
      } catch (e) {
        SLOT.set(iterator, '[[Done]]', true);
        if (e !== $StopIteration) {
          throw e;
        }
        return {
          done: true,
          value: void undefined
        };
      }
    }
  };
  SLOT.set(siIterator, '[[Iterator]]', origIterator);
  return siIterator;
};
},{"internal-slot":"Omom"}],"zrQN":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"VLVk":[function(require,module,exports) {
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
  try {
    strValue.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = require('has-tostringtag/shams')();
module.exports = function isString(value) {
  if (typeof value === 'string') {
    return true;
  }
  if (typeof value !== 'object') {
    return false;
  }
  return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};
},{"has-tostringtag/shams":"KpHW"}],"Qc2D":[function(require,module,exports) {
'use strict';

/** @const */
var $Map = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set = typeof Set === 'function' && Set.prototype ? Set : null;
var exported;
if (!$Map) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isMap(x) {
    // `Map` is not present in this environment.
    return false;
  };
}
var $mapHas = $Map ? Map.prototype.has : null;
var $setHas = $Set ? Set.prototype.has : null;
if (!exported && !$mapHas) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isMap(x) {
    // `Map` does not have a `has` method
    return false;
  };
}

/** @type {import('.')} */
module.exports = exported || function isMap(x) {
  if (!x || typeof x !== 'object') {
    return false;
  }
  try {
    $mapHas.call(x);
    if ($setHas) {
      try {
        $setHas.call(x);
      } catch (e) {
        return true;
      }
    }
    // @ts-expect-error TS can't figure out that $Map is always truthy here
    return x instanceof $Map; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
};
},{}],"OlG0":[function(require,module,exports) {
'use strict';

var $Map = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set = typeof Set === 'function' && Set.prototype ? Set : null;
var exported;
if (!$Set) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isSet(x) {
    // `Set` is not present in this environment.
    return false;
  };
}
var $mapHas = $Map ? Map.prototype.has : null;
var $setHas = $Set ? Set.prototype.has : null;
if (!exported && !$setHas) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isSet(x) {
    // `Set` does not have a `has` method
    return false;
  };
}

/** @type {import('.')} */
module.exports = exported || function isSet(x) {
  if (!x || typeof x !== 'object') {
    return false;
  }
  try {
    $setHas.call(x);
    if ($mapHas) {
      try {
        $mapHas.call(x);
      } catch (e) {
        return true;
      }
    }
    // @ts-expect-error TS can't figure out that $Set is always truthy here
    return x instanceof $Set; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
};
},{}],"pBGv":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"Lb2d":[function(require,module,exports) {
var process = require("process");
'use strict';

/* eslint global-require: 0 */
// the code is structured this way so that bundlers can
// alias out `has-symbols` to `() => true` or `() => false` if your target
// environments' Symbol capabilities are known, and then use
// dead code elimination on the rest of this module.
//
// Similarly, `isarray` can be aliased to `Array.isArray` if
// available in all target environments.

var isArguments = require('is-arguments');
var getStopIterationIterator = require('stop-iteration-iterator');

if (require('has-symbols')() || require('has-symbols/shams')()) {
	var $iterator = Symbol.iterator;
	// Symbol is available natively or shammed
	// natively:
	//  - Chrome >= 38
	//  - Edge 12-14?, Edge >= 15 for sure
	//  - FF >= 36
	//  - Safari >= 9
	//  - node >= 0.12
	module.exports = function getIterator(iterable) {
		// alternatively, `iterable[$iterator]?.()`
		if (iterable != null && typeof iterable[$iterator] !== 'undefined') {
			return iterable[$iterator]();
		}
		if (isArguments(iterable)) {
			// arguments objects lack Symbol.iterator
			// - node 0.12
			return Array.prototype[$iterator].call(iterable);
		}
	};
} else {
	// Symbol is not available, native or shammed
	var isArray = require('isarray');
	var isString = require('is-string');
	var GetIntrinsic = require('get-intrinsic');
	var $Map = GetIntrinsic('%Map%', true);
	var $Set = GetIntrinsic('%Set%', true);
	var callBound = require('call-bind/callBound');
	var $arrayPush = callBound('Array.prototype.push');
	var $charCodeAt = callBound('String.prototype.charCodeAt');
	var $stringSlice = callBound('String.prototype.slice');

	var advanceStringIndex = function advanceStringIndex(S, index) {
		var length = S.length;
		if ((index + 1) >= length) {
			return index + 1;
		}

		var first = $charCodeAt(S, index);
		if (first < 0xD800 || first > 0xDBFF) {
			return index + 1;
		}

		var second = $charCodeAt(S, index + 1);
		if (second < 0xDC00 || second > 0xDFFF) {
			return index + 1;
		}

		return index + 2;
	};

	var getArrayIterator = function getArrayIterator(arraylike) {
		var i = 0;
		return {
			next: function next() {
				var done = i >= arraylike.length;
				var value;
				if (!done) {
					value = arraylike[i];
					i += 1;
				}
				return {
					done: done,
					value: value
				};
			}
		};
	};

	var getNonCollectionIterator = function getNonCollectionIterator(iterable, noPrimordialCollections) {
		if (isArray(iterable) || isArguments(iterable)) {
			return getArrayIterator(iterable);
		}
		if (isString(iterable)) {
			var i = 0;
			return {
				next: function next() {
					var nextIndex = advanceStringIndex(iterable, i);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		}

		// es6-shim and es-shims' es-map use a string "_es6-shim iterator_" property on different iterables, such as MapIterator.
		if (noPrimordialCollections && typeof iterable['_es6-shim iterator_'] !== 'undefined') {
			return iterable['_es6-shim iterator_']();
		}
	};

	if (!$Map && !$Set) {
		// the only language iterables are Array, String, arguments
		// - Safari <= 6.0
		// - Chrome < 38
		// - node < 0.12
		// - FF < 13
		// - IE < 11
		// - Edge < 11

		module.exports = function getIterator(iterable) {
			if (iterable != null) {
				return getNonCollectionIterator(iterable, true);
			}
		};
	} else {
		// either Map or Set are available, but Symbol is not
		// - es6-shim on an ES5 browser
		// - Safari 6.2 (maybe 6.1?)
		// - FF v[13, 36)
		// - IE 11
		// - Edge 11
		// - Safari v[6, 9)

		var isMap = require('is-map');
		var isSet = require('is-set');

		// Firefox >= 27, IE 11, Safari 6.2 - 9, Edge 11, es6-shim in older envs, all have forEach
		var $mapForEach = callBound('Map.prototype.forEach', true);
		var $setForEach = callBound('Set.prototype.forEach', true);
		if (typeof process === 'undefined' || !process.versions || !process.versions.node) { // "if is not node"

			// Firefox 17 - 26 has `.iterator()`, whose iterator `.next()` either
			// returns a value, or throws a StopIteration object. These browsers
			// do not have any other mechanism for iteration.
			var $mapIterator = callBound('Map.prototype.iterator', true);
			var $setIterator = callBound('Set.prototype.iterator', true);
		}
		// Firefox 27-35, and some older es6-shim versions, use a string "@@iterator" property
		// this returns a proper iterator object, so we should use it instead of forEach.
		// newer es6-shim versions use a string "_es6-shim iterator_" property.
		var $mapAtAtIterator = callBound('Map.prototype.@@iterator', true) || callBound('Map.prototype._es6-shim iterator_', true);
		var $setAtAtIterator = callBound('Set.prototype.@@iterator', true) || callBound('Set.prototype._es6-shim iterator_', true);

		var getCollectionIterator = function getCollectionIterator(iterable) {
			if (isMap(iterable)) {
				if ($mapIterator) {
					return getStopIterationIterator($mapIterator(iterable));
				}
				if ($mapAtAtIterator) {
					return $mapAtAtIterator(iterable);
				}
				if ($mapForEach) {
					var entries = [];
					$mapForEach(iterable, function (v, k) {
						$arrayPush(entries, [k, v]);
					});
					return getArrayIterator(entries);
				}
			}
			if (isSet(iterable)) {
				if ($setIterator) {
					return getStopIterationIterator($setIterator(iterable));
				}
				if ($setAtAtIterator) {
					return $setAtAtIterator(iterable);
				}
				if ($setForEach) {
					var values = [];
					$setForEach(iterable, function (v) {
						$arrayPush(values, v);
					});
					return getArrayIterator(values);
				}
			}
		};

		module.exports = function getIterator(iterable) {
			return getCollectionIterator(iterable) || getNonCollectionIterator(iterable);
		};
	}
}

},{"is-arguments":"ordk","stop-iteration-iterator":"ieXR","has-symbols":"NS5K","has-symbols/shams":"jYt2","isarray":"zrQN","is-string":"VLVk","get-intrinsic":"LiLl","call-bind/callBound":"tAiC","is-map":"Qc2D","is-set":"OlG0","process":"pBGv"}],"md3r":[function(require,module,exports) {
'use strict';

var numberIsNaN = function (value) {
  return value !== value;
};
module.exports = function is(a, b) {
  if (a === 0 && b === 0) {
    return 1 / a === 1 / b;
  }
  if (a === b) {
    return true;
  }
  if (numberIsNaN(a) && numberIsNaN(b)) {
    return true;
  }
  return false;
};
},{}],"TyWm":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');
module.exports = function getPolyfill() {
  return typeof Object.is === 'function' ? Object.is : implementation;
};
},{"./implementation":"md3r"}],"Fi9R":[function(require,module,exports) {

'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');
module.exports = function shimObjectIs() {
  var polyfill = getPolyfill();
  define(Object, {
    is: polyfill
  }, {
    is: function testObjectIs() {
      return Object.is !== polyfill;
    }
  });
  return polyfill;
};
},{"./polyfill":"TyWm","define-properties":"VxKF"}],"pTr6":[function(require,module,exports) {

'use strict';

var define = require('define-properties');
var callBind = require('call-bind');
var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');
var polyfill = callBind(getPolyfill(), Object);
define(polyfill, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
module.exports = polyfill;
},{"define-properties":"VxKF","call-bind":"y9YS","./implementation":"md3r","./polyfill":"TyWm","./shim":"Fi9R"}],"fy46":[function(require,module,exports) {
'use strict';

var callBind = require('call-bind');
var callBound = require('call-bind/callBound');
var GetIntrinsic = require('get-intrinsic');
var $ArrayBuffer = GetIntrinsic('%ArrayBuffer%', true);
/** @type {undefined | ((receiver: ArrayBuffer) => number) | ((receiver: unknown) => never)} */
var $byteLength = callBound('ArrayBuffer.prototype.byteLength', true);
var $toString = callBound('Object.prototype.toString');

// in node 0.10, ArrayBuffers have no prototype methods, but have an own slot-checking `slice` method
var abSlice = !!$ArrayBuffer && !$byteLength && new $ArrayBuffer(0).slice;
var $abSlice = !!abSlice && callBind(abSlice);

/** @type {import('.')} */
module.exports = $byteLength || $abSlice ? function isArrayBuffer(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  try {
    if ($byteLength) {
      // @ts-expect-error no idea why TS can't handle the overload
      $byteLength(obj);
    } else {
      // @ts-expect-error TS chooses not to type-narrow inside a closure
      $abSlice(obj, 0);
    }
    return true;
  } catch (e) {
    return false;
  }
} : $ArrayBuffer
// in node 0.8, ArrayBuffers have no prototype or own methods, but also no Symbol.toStringTag
? function isArrayBuffer(obj) {
  return $toString(obj) === '[object ArrayBuffer]';
} : function isArrayBuffer(obj) {
  // eslint-disable-line no-unused-vars
  return false;
};
},{"call-bind":"y9YS","call-bind/callBound":"tAiC","get-intrinsic":"LiLl"}],"NyUK":[function(require,module,exports) {
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
  try {
    getDay.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = require('has-tostringtag/shams')();
module.exports = function isDateObject(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};
},{"has-tostringtag/shams":"KpHW"}],"DhUb":[function(require,module,exports) {
'use strict';

var callBound = require('call-bind/callBound');
var hasToStringTag = require('has-tostringtag/shams')();
var has;
var $exec;
var isRegexMarker;
var badStringifier;
if (hasToStringTag) {
  has = callBound('Object.prototype.hasOwnProperty');
  $exec = callBound('RegExp.prototype.exec');
  isRegexMarker = {};
  var throwRegexMarker = function () {
    throw isRegexMarker;
  };
  badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker
  };
  if (typeof Symbol.toPrimitive === 'symbol') {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }
}
var $toString = callBound('Object.prototype.toString');
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';
module.exports = hasToStringTag
// eslint-disable-next-line consistent-return
? function isRegex(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }
  var descriptor = gOPD(value, 'lastIndex');
  var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
  if (!hasLastIndexDataProperty) {
    return false;
  }
  try {
    $exec(value, badStringifier);
  } catch (e) {
    return e === isRegexMarker;
  }
} : function isRegex(value) {
  // In older browsers, typeof regex incorrectly returns 'function'
  if (!value || typeof value !== 'object' && typeof value !== 'function') {
    return false;
  }
  return $toString(value) === regexClass;
};
},{"call-bind/callBound":"tAiC","has-tostringtag/shams":"KpHW"}],"tGBX":[function(require,module,exports) {
'use strict';

var callBound = require('call-bind/callBound');

var $byteLength = callBound('SharedArrayBuffer.prototype.byteLength', true);

module.exports = $byteLength
	? function isSharedArrayBuffer(obj) {
		if (!obj || typeof obj !== 'object') {
			return false;
		}
		try {
			$byteLength(obj);
			return true;
		} catch (e) {
			return false;
		}
	}
	: function isSharedArrayBuffer(obj) { // eslint-disable-line no-unused-vars
		return false;
	};

},{"call-bind/callBound":"tAiC"}],"JEyY":[function(require,module,exports) {
'use strict';

var numToStr = Number.prototype.toString;
var tryNumberObject = function tryNumberObject(value) {
  try {
    numToStr.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
var toStr = Object.prototype.toString;
var numClass = '[object Number]';
var hasToStringTag = require('has-tostringtag/shams')();
module.exports = function isNumberObject(value) {
  if (typeof value === 'number') {
    return true;
  }
  if (typeof value !== 'object') {
    return false;
  }
  return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
};
},{"has-tostringtag/shams":"KpHW"}],"ohhR":[function(require,module,exports) {
'use strict';

var callBound = require('call-bind/callBound');
var $boolToStr = callBound('Boolean.prototype.toString');
var $toString = callBound('Object.prototype.toString');
var tryBooleanObject = function booleanBrandCheck(value) {
  try {
    $boolToStr(value);
    return true;
  } catch (e) {
    return false;
  }
};
var boolClass = '[object Boolean]';
var hasToStringTag = require('has-tostringtag/shams')();
module.exports = function isBoolean(value) {
  if (typeof value === 'boolean') {
    return true;
  }
  if (value === null || typeof value !== 'object') {
    return false;
  }
  return hasToStringTag && Symbol.toStringTag in value ? tryBooleanObject(value) : $toString(value) === boolClass;
};
},{"call-bind/callBound":"tAiC","has-tostringtag/shams":"KpHW"}],"js02":[function(require,module,exports) {
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = require('has-symbols')();
if (hasSymbols) {
  var symToStr = Symbol.prototype.toString;
  var symStringRegex = /^Symbol\(.*\)$/;
  var isSymbolObject = function isRealSymbolObject(value) {
    if (typeof value.valueOf() !== 'symbol') {
      return false;
    }
    return symStringRegex.test(symToStr.call(value));
  };
  module.exports = function isSymbol(value) {
    if (typeof value === 'symbol') {
      return true;
    }
    if (toStr.call(value) !== '[object Symbol]') {
      return false;
    }
    try {
      return isSymbolObject(value);
    } catch (e) {
      return false;
    }
  };
} else {
  module.exports = function isSymbol(value) {
    // this environment does not support Symbols.
    return false && value;
  };
}
},{"has-symbols":"NS5K"}],"diQb":[function(require,module,exports) {
'use strict';

var $BigInt = typeof BigInt !== 'undefined' && BigInt;

module.exports = function hasNativeBigInts() {
	return typeof $BigInt === 'function'
		&& typeof BigInt === 'function'
		&& typeof $BigInt(42) === 'bigint' // eslint-disable-line no-magic-numbers
		&& typeof BigInt(42) === 'bigint'; // eslint-disable-line no-magic-numbers
};

},{}],"lM0M":[function(require,module,exports) {
'use strict';

var hasBigInts = require('has-bigints')();

if (hasBigInts) {
	var bigIntValueOf = BigInt.prototype.valueOf;
	var tryBigInt = function tryBigIntObject(value) {
		try {
			bigIntValueOf.call(value);
			return true;
		} catch (e) {
		}
		return false;
	};

	module.exports = function isBigInt(value) {
		if (
			value === null
			|| typeof value === 'undefined'
			|| typeof value === 'boolean'
			|| typeof value === 'string'
			|| typeof value === 'number'
			|| typeof value === 'symbol'
			|| typeof value === 'function'
		) {
			return false;
		}
		if (typeof value === 'bigint') {
			return true;
		}

		return tryBigInt(value);
	};
} else {
	module.exports = function isBigInt(value) {
		return false && value;
	};
}

},{"has-bigints":"diQb"}],"rGgS":[function(require,module,exports) {
'use strict';

var isString = require('is-string');
var isNumber = require('is-number-object');
var isBoolean = require('is-boolean-object');
var isSymbol = require('is-symbol');
var isBigInt = require('is-bigint');

// eslint-disable-next-line consistent-return
module.exports = function whichBoxedPrimitive(value) {
	// eslint-disable-next-line eqeqeq
	if (value == null || (typeof value !== 'object' && typeof value !== 'function')) {
		return null;
	}
	if (isString(value)) {
		return 'String';
	}
	if (isNumber(value)) {
		return 'Number';
	}
	if (isBoolean(value)) {
		return 'Boolean';
	}
	if (isSymbol(value)) {
		return 'Symbol';
	}
	if (isBigInt(value)) {
		return 'BigInt';
	}
};

},{"is-string":"VLVk","is-number-object":"JEyY","is-boolean-object":"ohhR","is-symbol":"js02","is-bigint":"lM0M"}],"CJW7":[function(require,module,exports) {
'use strict';

var $WeakMap = typeof WeakMap === 'function' && WeakMap.prototype ? WeakMap : null;
var $WeakSet = typeof WeakSet === 'function' && WeakSet.prototype ? WeakSet : null;
var exported;
if (!$WeakMap) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isWeakMap(x) {
    // `WeakMap` is not present in this environment.
    return false;
  };
}
var $mapHas = $WeakMap ? $WeakMap.prototype.has : null;
var $setHas = $WeakSet ? $WeakSet.prototype.has : null;
if (!exported && !$mapHas) {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  exported = function isWeakMap(x) {
    // `WeakMap` does not have a `has` method
    return false;
  };
}

/** @type {import('.')} */
module.exports = exported || function isWeakMap(x) {
  if (!x || typeof x !== 'object') {
    return false;
  }
  try {
    $mapHas.call(x, $mapHas);
    if ($setHas) {
      try {
        $setHas.call(x, $setHas);
      } catch (e) {
        return true;
      }
    }
    // @ts-expect-error TS can't figure out that $WeakMap is always truthy here
    return x instanceof $WeakMap; // core-js workaround, pre-v3
  } catch (e) {}
  return false;
};
},{}],"YGNO":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var $WeakSet = GetIntrinsic('%WeakSet%', true);
var $setHas = callBound('WeakSet.prototype.has', true);
if ($setHas) {
  var $mapHas = callBound('WeakMap.prototype.has', true);

  /** @type {import('.')} */
  module.exports = function isWeakSet(x) {
    if (!x || typeof x !== 'object') {
      return false;
    }
    try {
      $setHas(x, $setHas);
      if ($mapHas) {
        try {
          $mapHas(x, $mapHas);
        } catch (e) {
          return true;
        }
      }
      // @ts-expect-error TS can't figure out that $WeakSet is always truthy here
      return x instanceof $WeakSet; // core-js workaround, pre-v3
    } catch (e) {}
    return false;
  };
} else {
  /** @type {import('.')} */
  // eslint-disable-next-line no-unused-vars
  module.exports = function isWeakSet(x) {
    // `WeakSet` does not exist, or does not have a `has` method
    return false;
  };
}
},{"get-intrinsic":"LiLl","call-bind/callBound":"tAiC"}],"iWc7":[function(require,module,exports) {
'use strict';

var isMap = require('is-map');
var isSet = require('is-set');
var isWeakMap = require('is-weakmap');
var isWeakSet = require('is-weakset');

/** @type {import('.')} */
module.exports = function whichCollection( /** @type {unknown} */value) {
  if (value && typeof value === 'object') {
    if (isMap(value)) {
      return 'Map';
    }
    if (isSet(value)) {
      return 'Set';
    }
    if (isWeakMap(value)) {
      return 'WeakMap';
    }
    if (isWeakSet(value)) {
      return 'WeakSet';
    }
  }
  return false;
};
},{"is-map":"Qc2D","is-set":"OlG0","is-weakmap":"CJW7","is-weakset":"YGNO"}],"b4C7":[function(require,module,exports) {
'use strict';

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
  try {
    badArrayLike = Object.defineProperty({}, 'length', {
      get: function () {
        throw isCallableMarker;
      }
    });
    isCallableMarker = {};
    // eslint-disable-next-line no-throw-literal
    reflectApply(function () {
      throw 42;
    }, null, badArrayLike);
  } catch (_) {
    if (_ !== isCallableMarker) {
      reflectApply = null;
    }
  }
} else {
  reflectApply = null;
}
var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
  try {
    var fnStr = fnToStr.call(value);
    return constructorRegex.test(fnStr);
  } catch (e) {
    return false; // not a function
  }
};

var tryFunctionObject = function tryFunctionToStr(value) {
  try {
    if (isES6ClassFn(value)) {
      return false;
    }
    fnToStr.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
var toStr = Object.prototype.toString;
var objectClass = '[object Object]';
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var ddaClass = '[object HTMLAllCollection]'; // IE 11
var ddaClass2 = '[object HTML document.all class]';
var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

var isDDA = function isDocumentDotAll() {
  return false;
};
if (typeof document === 'object') {
  // Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
  var all = document.all;
  if (toStr.call(all) === toStr.call(document.all)) {
    isDDA = function isDocumentDotAll(value) {
      /* globals document: false */
      // in IE 6-8, typeof document.all is "object" and it's truthy
      if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
        try {
          var str = toStr.call(value);
          return (str === ddaClass || str === ddaClass2 || str === ddaClass3 // opera 12.16
          || str === objectClass // IE 6-8
          ) && value('') == null; // eslint-disable-line eqeqeq
        } catch (e) {/**/}
      }
      return false;
    };
  }
}
module.exports = reflectApply ? function isCallable(value) {
  if (isDDA(value)) {
    return true;
  }
  if (!value) {
    return false;
  }
  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }
  try {
    reflectApply(value, null, badArrayLike);
  } catch (e) {
    if (e !== isCallableMarker) {
      return false;
    }
  }
  return !isES6ClassFn(value) && tryFunctionObject(value);
} : function isCallable(value) {
  if (isDDA(value)) {
    return true;
  }
  if (!value) {
    return false;
  }
  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }
  if (hasToStringTag) {
    return tryFunctionObject(value);
  }
  if (isES6ClassFn(value)) {
    return false;
  }
  var strClass = toStr.call(value);
  if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
    return false;
  }
  return tryFunctionObject(value);
};
},{}],"FXvN":[function(require,module,exports) {
'use strict';

var isCallable = require('is-callable');

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;

},{"is-callable":"b4C7"}],"VHB3":[function(require,module,exports) {
'use strict';

/** @type {import('.')} */
module.exports = ['Float32Array', 'Float64Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'BigInt64Array', 'BigUint64Array'];
},{}],"pUk4":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var possibleNames = require('possible-typed-array-names');
var g = typeof globalThis === 'undefined' ? global : globalThis;

/** @type {import('.')} */
module.exports = function availableTypedArrays() {
  var /** @type {ReturnType<typeof availableTypedArrays>} */out = [];
  for (var i = 0; i < possibleNames.length; i++) {
    if (typeof g[possibleNames[i]] === 'function') {
      // @ts-expect-error
      out[out.length] = possibleNames[i];
    }
  }
  return out;
};
},{"possible-typed-array-names":"VHB3"}],"xcUw":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBind = require('call-bind');
var callBound = require('call-bind/callBound');
var gOPD = require('gopd');

/** @type {(O: object) => string} */
var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();
var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();
var $slice = callBound('String.prototype.slice');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

/** @type {<T = unknown>(array: readonly T[], value: unknown) => number} */
var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
};

/** @typedef {(receiver: import('.').TypedArray) => string | typeof Uint8Array.prototype.slice.call | typeof Uint8Array.prototype.set.call} Getter */
/** @type {{ [k in `\$${import('.').TypedArrayName}`]?: Getter } & { __proto__: null }} */
var cache = {
  __proto__: null
};
if (hasToStringTag && gOPD && getPrototypeOf) {
  forEach(typedArrays, function (typedArray) {
    var arr = new g[typedArray]();
    if (Symbol.toStringTag in arr) {
      var proto = getPrototypeOf(arr);
      // @ts-expect-error TS won't narrow inside a closure
      var descriptor = gOPD(proto, Symbol.toStringTag);
      if (!descriptor) {
        var superProto = getPrototypeOf(proto);
        // @ts-expect-error TS won't narrow inside a closure
        descriptor = gOPD(superProto, Symbol.toStringTag);
      }
      // @ts-expect-error TODO: fix
      cache['$' + typedArray] = callBind(descriptor.get);
    }
  });
} else {
  forEach(typedArrays, function (typedArray) {
    var arr = new g[typedArray]();
    var fn = arr.slice || arr.set;
    if (fn) {
      // @ts-expect-error TODO: fix
      cache['$' + typedArray] = callBind(fn);
    }
  });
}

/** @type {(value: object) => false | import('.').TypedArrayName} */
var tryTypedArrays = function tryAllTypedArrays(value) {
  /** @type {ReturnType<typeof tryAllTypedArrays>} */var found = false;
  forEach(
  // eslint-disable-next-line no-extra-parens
  /** @type {Record<`\$${TypedArrayName}`, Getter>} */ /** @type {any} */
  cache, /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
  function (getter, typedArray) {
    if (!found) {
      try {
        // @ts-expect-error TODO: fix
        if ('$' + getter(value) === typedArray) {
          found = $slice(typedArray, 1);
        }
      } catch (e) {/**/}
    }
  });
  return found;
};

/** @type {(value: object) => false | import('.').TypedArrayName} */
var trySlices = function tryAllSlices(value) {
  /** @type {ReturnType<typeof tryAllSlices>} */var found = false;
  forEach(
  // eslint-disable-next-line no-extra-parens
  /** @type {Record<`\$${TypedArrayName}`, Getter>} */ /** @type {any} */
  cache, /** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */function (getter, name) {
    if (!found) {
      try {
        // @ts-expect-error TODO: fix
        getter(value);
        found = $slice(name, 1);
      } catch (e) {/**/}
    }
  });
  return found;
};

/** @type {import('.')} */
module.exports = function whichTypedArray(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (!hasToStringTag) {
    /** @type {string} */
    var tag = $slice($toString(value), 8, -1);
    if ($indexOf(typedArrays, tag) > -1) {
      return tag;
    }
    if (tag !== 'Object') {
      return false;
    }
    // node < 0.6 hits here on real Typed Arrays
    return trySlices(value);
  }
  if (!gOPD) {
    return null;
  } // unknown engine
  return tryTypedArrays(value);
};
},{"for-each":"FXvN","available-typed-arrays":"pUk4","call-bind":"y9YS","call-bind/callBound":"tAiC","gopd":"JuiR","has-tostringtag/shams":"KpHW"}],"K9MC":[function(require,module,exports) {
'use strict';

var callBound = require('call-bind/callBound');
var $byteLength = callBound('ArrayBuffer.prototype.byteLength', true);
var isArrayBuffer = require('is-array-buffer');

/** @type {import('.')} */
module.exports = function byteLength(ab) {
  if (!isArrayBuffer(ab)) {
    return NaN;
  }
  return $byteLength ? $byteLength(ab) : ab.byteLength;
}; // in node < 0.11, byteLength is an own nonconfigurable property
},{"call-bind/callBound":"tAiC","is-array-buffer":"fy46"}],"koiw":[function(require,module,exports) {
'use strict';

var assign = require('object.assign');
var callBound = require('call-bind/callBound');
var flags = require('regexp.prototype.flags');
var GetIntrinsic = require('get-intrinsic');
var getIterator = require('es-get-iterator');
var getSideChannel = require('side-channel');
var is = require('object-is');
var isArguments = require('is-arguments');
var isArray = require('isarray');
var isArrayBuffer = require('is-array-buffer');
var isDate = require('is-date-object');
var isRegex = require('is-regex');
var isSharedArrayBuffer = require('is-shared-array-buffer');
var objectKeys = require('object-keys');
var whichBoxedPrimitive = require('which-boxed-primitive');
var whichCollection = require('which-collection');
var whichTypedArray = require('which-typed-array');
var byteLength = require('array-buffer-byte-length');
var sabByteLength = callBound('SharedArrayBuffer.prototype.byteLength', true);
var $getTime = callBound('Date.prototype.getTime');
var gPO = Object.getPrototypeOf;
var $objToString = callBound('Object.prototype.toString');
var $Set = GetIntrinsic('%Set%', true);
var $mapHas = callBound('Map.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSize = callBound('Map.prototype.size', true);
var $setAdd = callBound('Set.prototype.add', true);
var $setDelete = callBound('Set.prototype.delete', true);
var $setHas = callBound('Set.prototype.has', true);
var $setSize = callBound('Set.prototype.size', true);

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L401-L414
function setHasEqualElement(set, val1, opts, channel) {
  var i = getIterator(set);
  var result;
  while ((result = i.next()) && !result.done) {
    if (internalDeepEqual(val1, result.value, opts, channel)) {
      // eslint-disable-line no-use-before-define
      // Remove the matching element to make sure we do not check that again.
      $setDelete(set, result.value);
      return true;
    }
  }
  return false;
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L416-L439
function findLooseMatchingPrimitives(prim) {
  if (typeof prim === 'undefined') {
    return null;
  }
  if (typeof prim === 'object') {
    // Only pass in null as object!
    return void 0;
  }
  if (typeof prim === 'symbol') {
    return false;
  }
  if (typeof prim === 'string' || typeof prim === 'number') {
    // Loose equal entries exist only if the string is possible to convert to a regular number and not NaN.
    return +prim === +prim; // eslint-disable-line no-implicit-coercion
  }

  return true;
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L449-L460
function mapMightHaveLoosePrim(a, b, prim, item, opts, channel) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) {
    return altValue;
  }
  var curB = $mapGet(b, altValue);
  var looseOpts = assign({}, opts, {
    strict: false
  });
  if (typeof curB === 'undefined' && !$mapHas(b, altValue)
  // eslint-disable-next-line no-use-before-define
  || !internalDeepEqual(item, curB, looseOpts, channel)) {
    return false;
  }
  // eslint-disable-next-line no-use-before-define
  return !$mapHas(a, altValue) && internalDeepEqual(item, curB, looseOpts, channel);
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L441-L447
function setMightHaveLoosePrim(a, b, prim) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) {
    return altValue;
  }
  return $setHas(b, altValue) && !$setHas(a, altValue);
}

// taken from https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/util/comparisons.js#L518-L533
function mapHasEqualEntry(set, map, key1, item1, opts, channel) {
  var i = getIterator(set);
  var result;
  var key2;
  while ((result = i.next()) && !result.done) {
    key2 = result.value;
    if (
    // eslint-disable-next-line no-use-before-define
    internalDeepEqual(key1, key2, opts, channel)
    // eslint-disable-next-line no-use-before-define
    && internalDeepEqual(item1, $mapGet(map, key2), opts, channel)) {
      $setDelete(set, key2);
      return true;
    }
  }
  return false;
}
function internalDeepEqual(actual, expected, options, channel) {
  var opts = options || {};

  // 7.1. All identical values are equivalent, as determined by ===.
  if (opts.strict ? is(actual, expected) : actual === expected) {
    return true;
  }
  var actualBoxed = whichBoxedPrimitive(actual);
  var expectedBoxed = whichBoxedPrimitive(expected);
  if (actualBoxed !== expectedBoxed) {
    return false;
  }

  // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
  if (!actual || !expected || typeof actual !== 'object' && typeof expected !== 'object') {
    return opts.strict ? is(actual, expected) : actual == expected; // eslint-disable-line eqeqeq
  }

  /*
   * 7.4. For all other Object pairs, including Array objects, equivalence is
   * determined by having the same number of owned properties (as verified
   * with Object.prototype.hasOwnProperty.call), the same set of keys
   * (although not necessarily the same order), equivalent values for every
   * corresponding key, and an identical 'prototype' property. Note: this
   * accounts for both named and indexed properties on Arrays.
   */
  // see https://github.com/nodejs/node/commit/d3aafd02efd3a403d646a3044adcf14e63a88d32 for memos/channel inspiration

  var hasActual = channel.has(actual);
  var hasExpected = channel.has(expected);
  var sentinel;
  if (hasActual && hasExpected) {
    if (channel.get(actual) === channel.get(expected)) {
      return true;
    }
  } else {
    sentinel = {};
  }
  if (!hasActual) {
    channel.set(actual, sentinel);
  }
  if (!hasExpected) {
    channel.set(expected, sentinel);
  }

  // eslint-disable-next-line no-use-before-define
  return objEquiv(actual, expected, opts, channel);
}
function isBuffer(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
    return false;
  }
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') {
    return false;
  }
  return !!(x.constructor && x.constructor.isBuffer && x.constructor.isBuffer(x));
}
function setEquiv(a, b, opts, channel) {
  if ($setSize(a) !== $setSize(b)) {
    return false;
  }
  var iA = getIterator(a);
  var iB = getIterator(b);
  var resultA;
  var resultB;
  var set;
  while ((resultA = iA.next()) && !resultA.done) {
    if (resultA.value && typeof resultA.value === 'object') {
      if (!set) {
        set = new $Set();
      }
      $setAdd(set, resultA.value);
    } else if (!$setHas(b, resultA.value)) {
      if (opts.strict) {
        return false;
      }
      if (!setMightHaveLoosePrim(a, b, resultA.value)) {
        return false;
      }
      if (!set) {
        set = new $Set();
      }
      $setAdd(set, resultA.value);
    }
  }
  if (set) {
    while ((resultB = iB.next()) && !resultB.done) {
      // We have to check if a primitive value is already matching and only if it's not, go hunting for it.
      if (resultB.value && typeof resultB.value === 'object') {
        if (!setHasEqualElement(set, resultB.value, opts.strict, channel)) {
          return false;
        }
      } else if (!opts.strict && !$setHas(a, resultB.value) && !setHasEqualElement(set, resultB.value, opts.strict, channel)) {
        return false;
      }
    }
    return $setSize(set) === 0;
  }
  return true;
}
function mapEquiv(a, b, opts, channel) {
  if ($mapSize(a) !== $mapSize(b)) {
    return false;
  }
  var iA = getIterator(a);
  var iB = getIterator(b);
  var resultA;
  var resultB;
  var set;
  var key;
  var item1;
  var item2;
  while ((resultA = iA.next()) && !resultA.done) {
    key = resultA.value[0];
    item1 = resultA.value[1];
    if (key && typeof key === 'object') {
      if (!set) {
        set = new $Set();
      }
      $setAdd(set, key);
    } else {
      item2 = $mapGet(b, key);
      if (typeof item2 === 'undefined' && !$mapHas(b, key) || !internalDeepEqual(item1, item2, opts, channel)) {
        if (opts.strict) {
          return false;
        }
        if (!mapMightHaveLoosePrim(a, b, key, item1, opts, channel)) {
          return false;
        }
        if (!set) {
          set = new $Set();
        }
        $setAdd(set, key);
      }
    }
  }
  if (set) {
    while ((resultB = iB.next()) && !resultB.done) {
      key = resultB.value[0];
      item2 = resultB.value[1];
      if (key && typeof key === 'object') {
        if (!mapHasEqualEntry(set, a, key, item2, opts, channel)) {
          return false;
        }
      } else if (!opts.strict && (!a.has(key) || !internalDeepEqual($mapGet(a, key), item2, opts, channel)) && !mapHasEqualEntry(set, a, key, item2, assign({}, opts, {
        strict: false
      }), channel)) {
        return false;
      }
    }
    return $setSize(set) === 0;
  }
  return true;
}
function objEquiv(a, b, opts, channel) {
  /* eslint max-statements: [2, 100], max-lines-per-function: [2, 120], max-depth: [2, 5], max-lines: [2, 400] */
  var i, key;
  if (typeof a !== typeof b) {
    return false;
  }
  if (a == null || b == null) {
    return false;
  }
  if ($objToString(a) !== $objToString(b)) {
    return false;
  }
  if (isArguments(a) !== isArguments(b)) {
    return false;
  }
  var aIsArray = isArray(a);
  var bIsArray = isArray(b);
  if (aIsArray !== bIsArray) {
    return false;
  }

  // TODO: replace when a cross-realm brand check is available
  var aIsError = a instanceof Error;
  var bIsError = b instanceof Error;
  if (aIsError !== bIsError) {
    return false;
  }
  if (aIsError || bIsError) {
    if (a.name !== b.name || a.message !== b.message) {
      return false;
    }
  }
  var aIsRegex = isRegex(a);
  var bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) {
    return false;
  }
  if ((aIsRegex || bIsRegex) && (a.source !== b.source || flags(a) !== flags(b))) {
    return false;
  }
  var aIsDate = isDate(a);
  var bIsDate = isDate(b);
  if (aIsDate !== bIsDate) {
    return false;
  }
  if (aIsDate || bIsDate) {
    // && would work too, because both are true or both false here
    if ($getTime(a) !== $getTime(b)) {
      return false;
    }
  }
  if (opts.strict && gPO && gPO(a) !== gPO(b)) {
    return false;
  }
  var aWhich = whichTypedArray(a);
  var bWhich = whichTypedArray(b);
  if (aWhich !== bWhich) {
    return false;
  }
  if (aWhich || bWhich) {
    // && would work too, because both are true or both false here
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  var aIsBuffer = isBuffer(a);
  var bIsBuffer = isBuffer(b);
  if (aIsBuffer !== bIsBuffer) {
    return false;
  }
  if (aIsBuffer || bIsBuffer) {
    // && would work too, because both are true or both false here
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  var aIsArrayBuffer = isArrayBuffer(a);
  var bIsArrayBuffer = isArrayBuffer(b);
  if (aIsArrayBuffer !== bIsArrayBuffer) {
    return false;
  }
  if (aIsArrayBuffer || bIsArrayBuffer) {
    // && would work too, because both are true or both false here
    if (byteLength(a) !== byteLength(b)) {
      return false;
    }
    return typeof Uint8Array === 'function' && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
  }
  var aIsSAB = isSharedArrayBuffer(a);
  var bIsSAB = isSharedArrayBuffer(b);
  if (aIsSAB !== bIsSAB) {
    return false;
  }
  if (aIsSAB || bIsSAB) {
    // && would work too, because both are true or both false here
    if (sabByteLength(a) !== sabByteLength(b)) {
      return false;
    }
    return typeof Uint8Array === 'function' && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
  }
  if (typeof a !== typeof b) {
    return false;
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length !== kb.length) {
    return false;
  }

  // the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  // ~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) {
      return false;
    } // eslint-disable-line eqeqeq
  }

  // equivalent values for every corresponding key, and ~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!internalDeepEqual(a[key], b[key], opts, channel)) {
      return false;
    }
  }
  var aCollection = whichCollection(a);
  var bCollection = whichCollection(b);
  if (aCollection !== bCollection) {
    return false;
  }
  if (aCollection === 'Set' || bCollection === 'Set') {
    // aCollection === bCollection
    return setEquiv(a, b, opts, channel);
  }
  if (aCollection === 'Map') {
    // aCollection === bCollection
    return mapEquiv(a, b, opts, channel);
  }
  return true;
}
module.exports = function deepEqual(a, b, opts) {
  return internalDeepEqual(a, b, opts, getSideChannel());
};
},{"object.assign":"Lcxy","call-bind/callBound":"tAiC","regexp.prototype.flags":"DbQL","get-intrinsic":"LiLl","es-get-iterator":"Lb2d","side-channel":"iGu9","object-is":"pTr6","is-arguments":"ordk","isarray":"zrQN","is-array-buffer":"fy46","is-date-object":"NyUK","is-regex":"DhUb","is-shared-array-buffer":"tGBX","object-keys":"ywQn","which-boxed-primitive":"rGgS","which-collection":"iWc7","which-typed-array":"xcUw","array-buffer-byte-length":"K9MC"}],"vLm1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.areaFactors = exports.GeojsonEquality = void 0;
exports.bearingToAzimuth = bearingToAzimuth;
exports.convertArea = convertArea;
exports.convertLength = convertLength;
exports.degreesToRadians = degreesToRadians;
exports.factors = exports.earthRadius = void 0;
exports.feature = feature;
exports.featureCollection = featureCollection;
exports.geometry = geometry;
exports.geometryCollection = geometryCollection;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.lengthToDegrees = lengthToDegrees;
exports.lengthToRadians = lengthToRadians;
exports.lineString = lineString;
exports.lineStrings = lineStrings;
exports.multiLineString = multiLineString;
exports.multiPoint = multiPoint;
exports.multiPolygon = multiPolygon;
exports.point = point;
exports.points = points;
exports.polygon = polygon;
exports.polygons = polygons;
exports.radiansToDegrees = radiansToDegrees;
exports.radiansToLength = radiansToLength;
exports.round = round;
exports.validateBBox = validateBBox;
exports.validateId = validateId;
var _deepEqual = _interopRequireDefault(require("deep-equal"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// lib/geojson-equality.ts

var _GeojsonEquality = class _GeojsonEquality {
  constructor(opts) {
    this.direction = false;
    this.compareProperties = true;
    var _a, _b, _c;
    this.precision = 10 ** -((_a = opts == null ? void 0 : opts.precision) != null ? _a : 17);
    this.direction = (_b = opts == null ? void 0 : opts.direction) != null ? _b : false;
    this.compareProperties = (_c = opts == null ? void 0 : opts.compareProperties) != null ? _c : true;
  }
  compare(g1, g2) {
    if (g1.type !== g2.type) {
      return false;
    }
    if (!sameLength(g1, g2)) {
      return false;
    }
    switch (g1.type) {
      case "Point":
        return this.compareCoord(g1.coordinates, g2.coordinates);
      case "LineString":
        return this.compareLine(g1.coordinates, g2.coordinates);
      case "Polygon":
        return this.comparePolygon(g1, g2);
      case "GeometryCollection":
        return this.compareGeometryCollection(g1, g2);
      case "Feature":
        return this.compareFeature(g1, g2);
      case "FeatureCollection":
        return this.compareFeatureCollection(g1, g2);
      default:
        if (g1.type.startsWith("Multi")) {
          const g1s = explode(g1);
          const g2s = explode(g2);
          return g1s.every(g1part => g2s.some(g2part => this.compare(g1part, g2part)));
        }
    }
    return false;
  }
  compareCoord(c1, c2) {
    return c1.length === c2.length && c1.every((c, i) => Math.abs(c - c2[i]) < this.precision);
  }
  compareLine(path1, path2, ind = 0, isPoly = false) {
    if (!sameLength(path1, path2)) {
      return false;
    }
    const p1 = path1;
    let p2 = path2;
    if (isPoly && !this.compareCoord(p1[0], p2[0])) {
      const startIndex = this.fixStartIndex(p2, p1);
      if (!startIndex) {
        return false;
      } else {
        p2 = startIndex;
      }
    }
    const sameDirection = this.compareCoord(p1[ind], p2[ind]);
    if (this.direction || sameDirection) {
      return this.comparePath(p1, p2);
    } else {
      if (this.compareCoord(p1[ind], p2[p2.length - (1 + ind)])) {
        return this.comparePath(p1.slice().reverse(), p2);
      }
      return false;
    }
  }
  fixStartIndex(sourcePath, targetPath) {
    let correctPath,
      ind = -1;
    for (let i = 0; i < sourcePath.length; i++) {
      if (this.compareCoord(sourcePath[i], targetPath[0])) {
        ind = i;
        break;
      }
    }
    if (ind >= 0) {
      correctPath = [].concat(sourcePath.slice(ind, sourcePath.length), sourcePath.slice(1, ind + 1));
    }
    return correctPath;
  }
  comparePath(p1, p2) {
    return p1.every((c, i) => this.compareCoord(c, p2[i]));
  }
  comparePolygon(g1, g2) {
    if (this.compareLine(g1.coordinates[0], g2.coordinates[0], 1, true)) {
      const holes1 = g1.coordinates.slice(1, g1.coordinates.length);
      const holes2 = g2.coordinates.slice(1, g2.coordinates.length);
      return holes1.every(h1 => holes2.some(h2 => this.compareLine(h1, h2, 1, true)));
    }
    return false;
  }
  compareGeometryCollection(g1, g2) {
    return sameLength(g1.geometries, g2.geometries) && this.compareBBox(g1, g2) && g1.geometries.every((g, i) => this.compare(g, g2.geometries[i]));
  }
  compareFeature(g1, g2) {
    return g1.id === g2.id && (this.compareProperties ? (0, _deepEqual.default)(g1.properties, g2.properties) : true) && this.compareBBox(g1, g2) && this.compare(g1.geometry, g2.geometry);
  }
  compareFeatureCollection(g1, g2) {
    return sameLength(g1.features, g2.features) && this.compareBBox(g1, g2) && g1.features.every((f, i) => this.compare(f, g2.features[i]));
  }
  compareBBox(g1, g2) {
    return Boolean(!g1.bbox && !g2.bbox) || (g1.bbox && g2.bbox ? this.compareCoord(g1.bbox, g2.bbox) : false);
  }
};
__name(_GeojsonEquality, "GeojsonEquality");
var GeojsonEquality = _GeojsonEquality;
exports.GeojsonEquality = GeojsonEquality;
function sameLength(g1, g2) {
  return g1.coordinates ? g1.coordinates.length === g2.coordinates.length : g1.length === g2.length;
}
__name(sameLength, "sameLength");
function explode(g) {
  return g.coordinates.map(part => ({
    type: g.type.replace("Multi", ""),
    coordinates: part
  }));
}
__name(explode, "explode");

// index.ts
var earthRadius = 63710088e-1;
exports.earthRadius = earthRadius;
var factors = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: 360 / (2 * Math.PI),
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1e3,
  kilometres: earthRadius / 1e3,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1e3,
  millimetres: earthRadius * 1e3,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius * 1.0936
};
exports.factors = factors;
var areaFactors = {
  acres: 247105e-9,
  centimeters: 1e4,
  centimetres: 1e4,
  feet: 10.763910417,
  hectares: 1e-4,
  inches: 1550.003100006,
  kilometers: 1e-6,
  kilometres: 1e-6,
  meters: 1,
  metres: 1,
  miles: 386e-9,
  nauticalmiles: 29155334959812285e-23,
  millimeters: 1e6,
  millimetres: 1e6,
  yards: 1.195990046
};
exports.areaFactors = areaFactors;
function feature(geom, properties, options = {}) {
  const feat = {
    type: "Feature"
  };
  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }
  if (options.bbox) {
    feat.bbox = options.bbox;
  }
  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}
__name(feature, "feature");
function geometry(type, coordinates, _options = {}) {
  switch (type) {
    case "Point":
      return point(coordinates).geometry;
    case "LineString":
      return lineString(coordinates).geometry;
    case "Polygon":
      return polygon(coordinates).geometry;
    case "MultiPoint":
      return multiPoint(coordinates).geometry;
    case "MultiLineString":
      return multiLineString(coordinates).geometry;
    case "MultiPolygon":
      return multiPolygon(coordinates).geometry;
    default:
      throw new Error(type + " is invalid");
  }
}
__name(geometry, "geometry");
function point(coordinates, properties, options = {}) {
  if (!coordinates) {
    throw new Error("coordinates is required");
  }
  if (!Array.isArray(coordinates)) {
    throw new Error("coordinates must be an Array");
  }
  if (coordinates.length < 2) {
    throw new Error("coordinates must be at least 2 numbers long");
  }
  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    throw new Error("coordinates must contain numbers");
  }
  const geom = {
    type: "Point",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(point, "point");
function points(coordinates, properties, options = {}) {
  return featureCollection(coordinates.map(coords => {
    return point(coords, properties);
  }), options);
}
__name(points, "points");
function polygon(coordinates, properties, options = {}) {
  for (const ring of coordinates) {
    if (ring.length < 4) {
      throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
    }
    if (ring[ring.length - 1].length !== ring[0].length) {
      throw new Error("First and last Position are not equivalent.");
    }
    for (let j = 0; j < ring[ring.length - 1].length; j++) {
      if (ring[ring.length - 1][j] !== ring[0][j]) {
        throw new Error("First and last Position are not equivalent.");
      }
    }
  }
  const geom = {
    type: "Polygon",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(polygon, "polygon");
function polygons(coordinates, properties, options = {}) {
  return featureCollection(coordinates.map(coords => {
    return polygon(coords, properties);
  }), options);
}
__name(polygons, "polygons");
function lineString(coordinates, properties, options = {}) {
  if (coordinates.length < 2) {
    throw new Error("coordinates must be an array of two or more positions");
  }
  const geom = {
    type: "LineString",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(lineString, "lineString");
function lineStrings(coordinates, properties, options = {}) {
  return featureCollection(coordinates.map(coords => {
    return lineString(coords, properties);
  }), options);
}
__name(lineStrings, "lineStrings");
function featureCollection(features, options = {}) {
  const fc = {
    type: "FeatureCollection"
  };
  if (options.id) {
    fc.id = options.id;
  }
  if (options.bbox) {
    fc.bbox = options.bbox;
  }
  fc.features = features;
  return fc;
}
__name(featureCollection, "featureCollection");
function multiLineString(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiLineString",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(multiLineString, "multiLineString");
function multiPoint(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiPoint",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(multiPoint, "multiPoint");
function multiPolygon(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiPolygon",
    coordinates
  };
  return feature(geom, properties, options);
}
__name(multiPolygon, "multiPolygon");
function geometryCollection(geometries, properties, options = {}) {
  const geom = {
    type: "GeometryCollection",
    geometries
  };
  return feature(geom, properties, options);
}
__name(geometryCollection, "geometryCollection");
function round(num, precision = 0) {
  if (precision && !(precision >= 0)) {
    throw new Error("precision must be a positive number");
  }
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(num * multiplier) / multiplier;
}
__name(round, "round");
function radiansToLength(radians, units = "kilometers") {
  const factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return radians * factor;
}
__name(radiansToLength, "radiansToLength");
function lengthToRadians(distance, units = "kilometers") {
  const factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return distance / factor;
}
__name(lengthToRadians, "lengthToRadians");
function lengthToDegrees(distance, units) {
  return radiansToDegrees(lengthToRadians(distance, units));
}
__name(lengthToDegrees, "lengthToDegrees");
function bearingToAzimuth(bearing) {
  let angle = bearing % 360;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}
__name(bearingToAzimuth, "bearingToAzimuth");
function radiansToDegrees(radians) {
  const degrees = radians % (2 * Math.PI);
  return degrees * 180 / Math.PI;
}
__name(radiansToDegrees, "radiansToDegrees");
function degreesToRadians(degrees) {
  const radians = degrees % 360;
  return radians * Math.PI / 180;
}
__name(degreesToRadians, "degreesToRadians");
function convertLength(length, originalUnit = "kilometers", finalUnit = "kilometers") {
  if (!(length >= 0)) {
    throw new Error("length must be a positive number");
  }
  return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
__name(convertLength, "convertLength");
function convertArea(area, originalUnit = "meters", finalUnit = "kilometers") {
  if (!(area >= 0)) {
    throw new Error("area must be a positive number");
  }
  const startFactor = areaFactors[originalUnit];
  if (!startFactor) {
    throw new Error("invalid original units");
  }
  const finalFactor = areaFactors[finalUnit];
  if (!finalFactor) {
    throw new Error("invalid final units");
  }
  return area / startFactor * finalFactor;
}
__name(convertArea, "convertArea");
function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
__name(isNumber, "isNumber");
function isObject(input) {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}
__name(isObject, "isObject");
function validateBBox(bbox) {
  if (!bbox) {
    throw new Error("bbox is required");
  }
  if (!Array.isArray(bbox)) {
    throw new Error("bbox must be an Array");
  }
  if (bbox.length !== 4 && bbox.length !== 6) {
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  }
  bbox.forEach(num => {
    if (!isNumber(num)) {
      throw new Error("bbox must only contain numbers");
    }
  });
}
__name(validateBBox, "validateBBox");
function validateId(id) {
  if (!id) {
    throw new Error("id is required");
  }
  if (["string", "number"].indexOf(typeof id) === -1) {
    throw new Error("id must be a number or a string");
  }
}
__name(validateId, "validateId");
},{"deep-equal":"koiw"}],"OYqY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectionOf = collectionOf;
exports.containsNumber = containsNumber;
exports.featureOf = featureOf;
exports.geojsonType = geojsonType;
exports.getCoord = getCoord;
exports.getCoords = getCoords;
exports.getGeom = getGeom;
exports.getType = getType;
var _helpers = require("@turf/helpers");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// index.ts

function getCoord(coord) {
  if (!coord) {
    throw new Error("coord is required");
  }
  if (!Array.isArray(coord)) {
    if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
      return [...coord.geometry.coordinates];
    }
    if (coord.type === "Point") {
      return [...coord.coordinates];
    }
  }
  if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
    return [...coord];
  }
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
__name(getCoord, "getCoord");
function getCoords(coords) {
  if (Array.isArray(coords)) {
    return coords;
  }
  if (coords.type === "Feature") {
    if (coords.geometry !== null) {
      return coords.geometry.coordinates;
    }
  } else {
    if (coords.coordinates) {
      return coords.coordinates;
    }
  }
  throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}
__name(getCoords, "getCoords");
function containsNumber(coordinates) {
  if (coordinates.length > 1 && (0, _helpers.isNumber)(coordinates[0]) && (0, _helpers.isNumber)(coordinates[1])) {
    return true;
  }
  if (Array.isArray(coordinates[0]) && coordinates[0].length) {
    return containsNumber(coordinates[0]);
  }
  throw new Error("coordinates must only contain numbers");
}
__name(containsNumber, "containsNumber");
function geojsonType(value, type, name) {
  if (!type || !name) {
    throw new Error("type and name required");
  }
  if (!value || value.type !== type) {
    throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + value.type);
  }
}
__name(geojsonType, "geojsonType");
function featureOf(feature, type, name) {
  if (!feature) {
    throw new Error("No feature passed");
  }
  if (!name) {
    throw new Error(".featureOf() requires a name");
  }
  if (!feature || feature.type !== "Feature" || !feature.geometry) {
    throw new Error("Invalid input to " + name + ", Feature with geometry required");
  }
  if (!feature.geometry || feature.geometry.type !== type) {
    throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
  }
}
__name(featureOf, "featureOf");
function collectionOf(featureCollection, type, name) {
  if (!featureCollection) {
    throw new Error("No featureCollection passed");
  }
  if (!name) {
    throw new Error(".collectionOf() requires a name");
  }
  if (!featureCollection || featureCollection.type !== "FeatureCollection") {
    throw new Error("Invalid input to " + name + ", FeatureCollection required");
  }
  for (const feature of featureCollection.features) {
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
      throw new Error("Invalid input to " + name + ", Feature with geometry required");
    }
    if (!feature.geometry || feature.geometry.type !== type) {
      throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
    }
  }
}
__name(collectionOf, "collectionOf");
function getGeom(geojson) {
  if (geojson.type === "Feature") {
    return geojson.geometry;
  }
  return geojson;
}
__name(getGeom, "getGeom");
function getType(geojson, _name) {
  if (geojson.type === "FeatureCollection") {
    return "FeatureCollection";
  }
  if (geojson.type === "GeometryCollection") {
    return "GeometryCollection";
  }
  if (geojson.type === "Feature" && geojson.geometry !== null) {
    return geojson.geometry.type;
  }
  return geojson.type;
}
__name(getType, "getType");
},{"@turf/helpers":"vLm1"}],"TnwV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.booleanClockwise = booleanClockwise;
exports.default = void 0;
var _invariant = require("@turf/invariant");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// index.ts

function booleanClockwise(line) {
  const ring = (0, _invariant.getCoords)(line);
  let sum = 0;
  let i = 1;
  let prev;
  let cur;
  while (i < ring.length) {
    prev = cur || ring[0];
    cur = ring[i];
    sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
    i++;
  }
  return sum > 0;
}
__name(booleanClockwise, "booleanClockwise");
var turf_boolean_clockwise_default = booleanClockwise;
exports.default = turf_boolean_clockwise_default;
},{"@turf/invariant":"OYqY"}],"JgJX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordAll = coordAll;
exports.coordEach = coordEach;
exports.coordReduce = coordReduce;
exports.featureEach = featureEach;
exports.featureReduce = featureReduce;
exports.findPoint = findPoint;
exports.findSegment = findSegment;
exports.flattenEach = flattenEach;
exports.flattenReduce = flattenReduce;
exports.geomEach = geomEach;
exports.geomReduce = geomReduce;
exports.lineEach = lineEach;
exports.lineReduce = lineReduce;
exports.propEach = propEach;
exports.propReduce = propReduce;
exports.segmentEach = segmentEach;
exports.segmentReduce = segmentReduce;
var _helpers = require("@turf/helpers");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// index.js

function coordEach(geojson, callback, excludeWrapCoord) {
  if (geojson === null) return;
  var j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === "FeatureCollection",
    isFeature = type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;
      if (geometry === null) continue;
      coords = geometry.coordinates;
      var geomType = geometry.type;
      wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;
      switch (geomType) {
        case null:
          break;
        case "Point":
          if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry.geometries.length; j++) if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}
__name(coordEach, "coordEach");
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
  var previousValue = initialValue;
  coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
    if (coordIndex === 0 && initialValue === void 0) previousValue = currentCoord;else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
  }, excludeWrapCoord);
  return previousValue;
}
__name(coordReduce, "coordReduce");
function propEach(geojson, callback) {
  var i;
  switch (geojson.type) {
    case "FeatureCollection":
      for (i = 0; i < geojson.features.length; i++) {
        if (callback(geojson.features[i].properties, i) === false) break;
      }
      break;
    case "Feature":
      callback(geojson.properties, 0);
      break;
  }
}
__name(propEach, "propEach");
function propReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  propEach(geojson, function (currentProperties, featureIndex) {
    if (featureIndex === 0 && initialValue === void 0) previousValue = currentProperties;else previousValue = callback(previousValue, currentProperties, featureIndex);
  });
  return previousValue;
}
__name(propReduce, "propReduce");
function featureEach(geojson, callback) {
  if (geojson.type === "Feature") {
    callback(geojson, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (callback(geojson.features[i], i) === false) break;
    }
  }
}
__name(featureEach, "featureEach");
function featureReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  featureEach(geojson, function (currentFeature, featureIndex) {
    if (featureIndex === 0 && initialValue === void 0) previousValue = currentFeature;else previousValue = callback(previousValue, currentFeature, featureIndex);
  });
  return previousValue;
}
__name(featureReduce, "featureReduce");
function coordAll(geojson) {
  var coords = [];
  coordEach(geojson, function (coord) {
    coords.push(coord);
  });
  return coords;
}
__name(coordAll, "coordAll");
function geomEach(geojson, callback) {
  var i,
    j,
    g,
    geometry,
    stopG,
    geometryMaybeCollection,
    isGeometryCollection,
    featureProperties,
    featureBBox,
    featureId,
    featureIndex = 0,
    isFeatureCollection = geojson.type === "FeatureCollection",
    isFeature = geojson.type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
    featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
    featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
    featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
      if (geometry === null) {
        if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon":
          {
            if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
            break;
          }
        case "GeometryCollection":
          {
            for (j = 0; j < geometry.geometries.length; j++) {
              if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
            }
            break;
          }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    featureIndex++;
  }
}
__name(geomEach, "geomEach");
function geomReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
    if (featureIndex === 0 && initialValue === void 0) previousValue = currentGeometry;else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
  });
  return previousValue;
}
__name(geomReduce, "geomReduce");
function flattenEach(geojson, callback) {
  geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (callback((0, _helpers.feature)(geometry, properties, {
          bbox,
          id
        }), featureIndex, 0) === false) return false;
        return;
    }
    var geomType;
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }
    for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
      var coordinate = geometry.coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate
      };
      if (callback((0, _helpers.feature)(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
    }
  });
}
__name(flattenEach, "flattenEach");
function flattenReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
    if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === void 0) previousValue = currentFeature;else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
  });
  return previousValue;
}
__name(flattenReduce, "flattenReduce");
function segmentEach(geojson, callback) {
  flattenEach(geojson, function (feature2, featureIndex, multiFeatureIndex) {
    var segmentIndex = 0;
    if (!feature2.geometry) return;
    var type = feature2.geometry.type;
    if (type === "Point" || type === "MultiPoint") return;
    var previousCoords;
    var previousFeatureIndex = 0;
    var previousMultiIndex = 0;
    var prevGeomIndex = 0;
    if (coordEach(feature2, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
      if (previousCoords === void 0 || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
        previousCoords = currentCoord;
        previousFeatureIndex = featureIndex;
        previousMultiIndex = multiPartIndexCoord;
        prevGeomIndex = geometryIndex;
        segmentIndex = 0;
        return;
      }
      var currentSegment = (0, _helpers.lineString)([previousCoords, currentCoord], feature2.properties);
      if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
      segmentIndex++;
      previousCoords = currentCoord;
    }) === false) return false;
  });
}
__name(segmentEach, "segmentEach");
function segmentReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  var started = false;
  segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
    if (started === false && initialValue === void 0) previousValue = currentSegment;else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
    started = true;
  });
  return previousValue;
}
__name(segmentReduce, "segmentReduce");
function lineEach(geojson, callback) {
  if (!geojson) throw new Error("geojson is required");
  flattenEach(geojson, function (feature2, featureIndex, multiFeatureIndex) {
    if (feature2.geometry === null) return;
    var type = feature2.geometry.type;
    var coords = feature2.geometry.coordinates;
    switch (type) {
      case "LineString":
        if (callback(feature2, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
        break;
      case "Polygon":
        for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
          if (callback((0, _helpers.lineString)(coords[geometryIndex], feature2.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
        }
        break;
    }
  });
}
__name(lineEach, "lineEach");
function lineReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
    if (featureIndex === 0 && initialValue === void 0) previousValue = currentLine;else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
  });
  return previousValue;
}
__name(lineReduce, "lineReduce");
function findSegment(geojson, options) {
  options = options || {};
  if (!(0, _helpers.isObject)(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var segmentIndex = options.segmentIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
      if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
      return (0, _helpers.lineString)([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
      return (0, _helpers.lineString)([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
    case "MultiLineString":
      if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
      if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
      return (0, _helpers.lineString)([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
    case "MultiPolygon":
      if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
      return (0, _helpers.lineString)([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
  }
  throw new Error("geojson is invalid");
}
__name(findSegment, "findSegment");
function findPoint(geojson, options) {
  options = options || {};
  if (!(0, _helpers.isObject)(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var coordIndex = options.coordIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
      return (0, _helpers.point)(coords, properties, options);
    case "MultiPoint":
      if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
      return (0, _helpers.point)(coords[multiFeatureIndex], properties, options);
    case "LineString":
      if (coordIndex < 0) coordIndex = coords.length + coordIndex;
      return (0, _helpers.point)(coords[coordIndex], properties, options);
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
      return (0, _helpers.point)(coords[geometryIndex][coordIndex], properties, options);
    case "MultiLineString":
      if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
      if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
      return (0, _helpers.point)(coords[multiFeatureIndex][coordIndex], properties, options);
    case "MultiPolygon":
      if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
      return (0, _helpers.point)(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
  }
  throw new Error("geojson is invalid");
}
__name(findPoint, "findPoint");
},{"@turf/helpers":"vLm1"}],"XLk5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.rewind = rewind;
var _clone = require("@turf/clone");
var _booleanClockwise = require("@turf/boolean-clockwise");
var _meta = require("@turf/meta");
var _invariant = require("@turf/invariant");
var _helpers = require("@turf/helpers");
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

// index.ts

function rewind(geojson, options = {}) {
  var _a, _b;
  options = options || {};
  if (!(0, _helpers.isObject)(options)) throw new Error("options is invalid");
  const mutate = (_a = options.mutate) != null ? _a : false;
  const reverse = (_b = options.reverse) != null ? _b : false;
  if (!geojson) throw new Error("<geojson> is required");
  if (typeof reverse !== "boolean") throw new Error("<reverse> must be a boolean");
  if (typeof mutate !== "boolean") throw new Error("<mutate> must be a boolean");
  if (!mutate && geojson.type !== "Point" && geojson.type !== "MultiPoint") {
    geojson = (0, _clone.clone)(geojson);
  }
  const results = [];
  switch (geojson.type) {
    case "GeometryCollection":
      (0, _meta.geomEach)(geojson, function (geometry) {
        rewindFeature(geometry, reverse);
      });
      return geojson;
    case "FeatureCollection":
      (0, _meta.featureEach)(geojson, function (feature) {
        const rewoundFeature = rewindFeature(feature, reverse);
        (0, _meta.featureEach)(rewoundFeature, function (result) {
          results.push(result);
        });
      });
      return (0, _helpers.featureCollection)(results);
  }
  return rewindFeature(geojson, reverse);
}
__name(rewind, "rewind");
function rewindFeature(geojson, reverse) {
  const type = geojson.type === "Feature" ? geojson.geometry.type : geojson.type;
  switch (type) {
    case "GeometryCollection":
      (0, _meta.geomEach)(geojson, function (geometry) {
        rewindFeature(geometry, reverse);
      });
      return geojson;
    case "LineString":
      rewindLineString((0, _invariant.getCoords)(geojson), reverse);
      return geojson;
    case "Polygon":
      rewindPolygon((0, _invariant.getCoords)(geojson), reverse);
      return geojson;
    case "MultiLineString":
      (0, _invariant.getCoords)(geojson).forEach(function (lineCoords) {
        rewindLineString(lineCoords, reverse);
      });
      return geojson;
    case "MultiPolygon":
      (0, _invariant.getCoords)(geojson).forEach(function (lineCoords) {
        rewindPolygon(lineCoords, reverse);
      });
      return geojson;
    case "Point":
    case "MultiPoint":
      return geojson;
  }
}
__name(rewindFeature, "rewindFeature");
function rewindLineString(coords, reverse) {
  if ((0, _booleanClockwise.booleanClockwise)(coords) === reverse) coords.reverse();
}
__name(rewindLineString, "rewindLineString");
function rewindPolygon(coords, reverse) {
  if ((0, _booleanClockwise.booleanClockwise)(coords[0]) !== reverse) {
    coords[0].reverse();
  }
  for (let i = 1; i < coords.length; i++) {
    if ((0, _booleanClockwise.booleanClockwise)(coords[i]) === reverse) {
      coords[i].reverse();
    }
  }
}
__name(rewindPolygon, "rewindPolygon");
var turf_rewind_default = rewind;
exports.default = turf_rewind_default;
},{"@turf/clone":"qBTa","@turf/boolean-clockwise":"TnwV","@turf/meta":"JgJX","@turf/invariant":"OYqY","@turf/helpers":"vLm1"}],"LFDw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBoroughs = addBoroughs;
exports.addDateAttributes = addDateAttributes;
exports.defineColorScaleGravity = defineColorScaleGravity;
exports.getDistinctGravite = getDistinctGravite;
exports.getDistinctYear = getDistinctYear;
exports.replaceValues = replaceValues;
exports.reverseGeoJsonCoordinates = reverseGeoJsonCoordinates;
exports.setCoordinates = setCoordinates;
var _rewind = _interopRequireDefault(require("@turf/rewind"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * Reverses the coordinates in the GeoJson data using turf's rewind function.
 * See here : https://turfjs.org/docs/#rewind
 *
 * @param {*} data The data to be displayed
 * @returns {*} The GeoJson data with reversed coordinates.
 */
function reverseGeoJsonCoordinates(data) {
  return (0, _rewind.default)(data, {
    reverse: true
  });
}

/**
 * Add date attributes to the dataset.
 *
 * @param {object[]} data The data to analyze
 */
function addDateAttributes(data) {
  data.map(function (d) {
    d.Year = d.DT_ACCDN.getYear() + 1900;
    d.WeekDay = d.DT_ACCDN.getDay();
    d.WeekDayName = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][d.WeekDay - 1];
    d.Month = d.DT_ACCDN.getMonth();
    d.MonthName = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][d.Month];
  });
}

/**
 * Description.
 *
 * @param {object[]} data The accident data
 * @returns {object[]} data
 */
function replaceValues(data) {
  return data.map(function (d) {
    return d.GRAVITE === 'Dommages materiels inferieurs au seuil de rapportage' ? _objectSpread(_objectSpread({}, d), {}, {
      GRAVITE: 'Non applicable'
    }) : d;
  });
}

/**
 * Description.
 *
 * @param {object[]} data The data to analyze
 * @param {*} projection The projection to use to convert the longitude and latitude
 */
function setCoordinates(data, projection) {
  data.map(function (d) {
    var coord = projection([d.LOC_LONG, d.LOC_LAT]);
    d.x = coord[0];
    d.y = coord[1];
    // delete d.LOC_LONG
    // delete d.LOC_LAT
  });
}

/**
 * Description.
 *
 * @param {object[]} data The accident data
 * @param {object[]} borough The borough multipolygons
 */
function addBoroughs(data, borough) {
  console.log(data);
  console.log(borough);
}

/**
 * Defines the color scale used in the graph.
 *
 * @returns {*} The color scale to be used inthe graph
 */
function defineColorScaleGravity() {
  var graviteColors = [{
    Gravite: 'Dommages materiels inferieurs au seuil de rapportage',
    Color: '#34C6BB'
  },
  // Green
  {
    Gravite: 'Dommages materiels seulement',
    Color: '#99E3DD'
  },
  // Lighter green
  {
    Gravite: 'Leger',
    Color: '#F2C80F'
  },
  // Yellow
  {
    Gravite: 'Grave',
    Color: '#FE9666'
  },
  // Orange
  {
    Gravite: 'Mortel',
    Color: '#FD625E'
  } // Red
  ];

  var gravite = graviteColors.map(function (arr) {
    return arr.Gravite;
  });
  var colors = graviteColors.map(function (arr) {
    return arr.Color;
  });
  return d3.scaleOrdinal().range(colors).domain(gravite);
}

/**
 * Defines the color scale used in the graph.
 *
 * @param {object[]} data The accident data
 * @returns {*} The color scale to be used inthe graph
 */
function getDistinctYear(data) {
  return _toConsumableArray(new Set(data.map(function (i) {
    return i.Year;
  })));
}

/**
 * Defines the color scale used in the graph.
 *
 * @param {object[]} data The accident data
 * @returns {*} The color scale to be used inthe graph
 */
function getDistinctGravite(data) {
  return _toConsumableArray(new Set(data.map(function (i) {
    return i.GRAVITE;
  })));
}
},{"@turf/rewind":"XLk5"}],"tPCs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawButton = drawButton;
exports.getWidth = getWidth;
exports.getXPositionArray = getXPositionArray;
/**
 * Draws the button to toggle the display year.
 *
 * @param {*} data The d3 Selection of the graph's g SVG element
 * @param {*} title The d3 Selection of the graph's g SVG element
 */
function drawButton(data, title) {
  var buttonHeight = 30;
  var groupWidth = getWidth();
  var positionArray = getXPositionArray(data, groupWidth);

  // Title
  d3.select('.filter').append('text').text(title).attr('font-size', '14px');

  // Groups
  var buttonGroup = d3.select('.filter').append('svg').attr('class', 'section').attr('width', groupWidth).attr('height', buttonHeight * 2).selectAll('svg').data(data).enter().append('svg').attr('id', function (d) {
    return 'button-svg-' + d;
  });

  // Rectangles
  buttonGroup.append('rect').attr('class', 'button').attr('id', function (d) {
    return 'button-rect-' + d;
  }).attr('width', function (d) {
    return positionArray.filter(function (p) {
      return p.Key === d;
    })[0].Width * 0.98;
  }).attr('height', buttonHeight).attr('x', function (d) {
    return positionArray.filter(function (p) {
      return p.Key === d;
    })[0].Position;
  }).attr('y', buttonHeight * 0.5).attr('fill', '#33333').attr('rx', buttonHeight / 2).on('mouseenter', function () {
    d3.select(this).attr('opacity', 0.8);
  }).on('mouseleave', function () {
    d3.select(this).attr('opacity', 1);
  }).on('click', function () {
    var _this = this;
    d3.select(this).attr('fill', function (d) {
      return d3.select(_this).attr('fill') === '#33333' ? '#EAEAEA' : '#33333';
    });
    d3.select(this.parentNode).selectAll('text').attr('fill', function (d) {
      return d3.select(_this.parentNode).selectAll('text').attr('fill') === '#33333' ? '#EAEAEA' : '#33333';
    });
  });

  // Text
  buttonGroup.append('text').attr('id', function (d) {
    return 'button-text-' + d;
  }).attr('text-anchor', 'middle').text(function (d) {
    return d;
  }).attr('x', function (d) {
    return positionArray.filter(function (p) {
      return p.Key === d;
    })[0].Position + positionArray.filter(function (p) {
      return p.Key === d;
    })[0].Width / 2;
  }).attr('y', buttonHeight * 1.2).attr('font-size', '14px').attr('fill', '#fff').attr('pointer-events', 'none');
}

/**
 * Draws the button to toggle the display year.
 *
 * @returns {number} dimensions
 */
function getWidth() {
  var parentNode = d3.select('.filter').node();
  var bounds = parentNode.getBoundingClientRect();
  var padding = {
    left: parseFloat(window.getComputedStyle(parentNode).paddingLeft),
    right: parseFloat(window.getComputedStyle(parentNode).paddingRight)
  };
  return bounds.width - padding.left - padding.right;
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {*} data The d3 Selection of the graph's g SVG element
 * @param {*} width The d3 Selection of the graph's g SVG element
 * @returns {object[]} scale
 */
function getXPositionArray(data, width) {
  var totalLength = data.map(function (d) {
    return d.toString().length;
  }).reduce(function (a, b) {
    return a + b;
  });
  var dataArray = [];
  data.forEach(function (d) {
    return dataArray.push({
      // Index: dataArray.length,
      Key: d,
      // Length: d.toString().length,
      Width: d.toString().length / totalLength * width,
      Position: dataArray.length === 0 ? 0 : d.toString().length / totalLength * width
    });
  });
  dataArray.map(function (d, index, self) {
    if (index === 0) {
      d.Position = 0;
    } else {
      d.Position = self[index - 1].Position + self[index - 1].Width;
    }
  });
  return dataArray;
}
},{}],"VMO8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawMap = drawMap;
exports.eventClick = eventClick;
exports.eventTooltip = eventTooltip;
exports.getPath = getPath;
exports.getProjection = getProjection;
/**
 * Sets up the projection to be used.
 *
 * @returns {*} The projection to use to trace the map elements
 */
function getProjection() {
  return d3.geoMercator().center([-73.708879, 45.579611]).scale(70000);
}

/**
 * Sets up the path to be used.
 *
 * @param {*} projection The projection used to trace the map elements
 * @returns {*} The path to use to trace the map elements
 */
function getPath(projection) {
  return d3.geoPath().projection(projection);
}

/**
 * Draws the map base of Montreal. Each neighborhood should display its name when hovered.
 *
 * @param {object[]} data The data for the map base
 * @param {*} path The path associated with the current projection
 */
function drawMap(data, path) {
  var groups = d3.select('#map').append('g').attr('id', 'map-g').append('g').selectAll('g').data(data.features).enter().append('g');
  var map = groups.append('path').attr('d', path).attr('class', 'area').attr('stroke-width', 1).attr('stroke', '#a7a7a0').attr('fill', 'white');
  eventTooltip(map);
  // eventClick(map)
}

/**
 * Each neighborhood should display its name when hovered.
 *
 * @param {Element} map Map element
 */
function eventTooltip(map) {
  var tooltip = d3.select('body')
  // const tooltip = d3.select('#map')
  .append('div').attr('class', 'tooltip').style('position', 'absolute').style('pointer-events', 'none').style('color', 'black').style('padding', '10px');
  map.on('mouseover', function (event, d) {
    tooltip.style('display', 'block').text(d.properties.NOM);
  }).on('mousemove', function (event) {
    tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 25 + 'px');
  }).on('mouseout', function () {
    d3.selectAll('.tooltip').style('display', 'none');
  })
  // .on('click', function (event, d) { console.log(d.properties.NOM) })
  .on('click', function (event, d) {
    eventClick(event, d);
  });
}

/**
 * Draws the map base of Montreal.
 *
 * @param {Element} event Map element
 * @param {Element} d Map element
 */
function eventClick(event, d) {
  // map.on('click', function () { console.log(map) })
  console.log(d.properties.NOM);
}
},{}],"bs3w":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawDots = drawDots;
/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 * @param {*} color The color scaled used to determine the color of the circles
 */
function drawDots(data, color) {
  console.log(data);
  console.log('TEST');
  var svg = d3.select('.main-svg');

  // svg.selectAll('.marker')
  //   .data(data)
  //   .enter()
  //   .append('circle')
  //   .attr('class', 'marker')
  //   .attr('cx', d => d.x)
  //   .attr('cy', d => d.y)
  //   // .attr('cx', d => d.LOC_LAT)
  //   // .attr('cy', d => d.LOC_LONG)
  //   .attr('r', 5)
  //   // .attr('fill', d => color(d.properties.TYPE_SITE_INTERVENTION))
  //   .attr('fill', 'red')
  //   // .attr('id', d => d.properties.TYPE_SITE_INTERVENTION)
  //   .attr('stroke', '#fff')
  //   .attr('stroke-width', 1)
  //   // .on('mouseover', function () {
  //   //   d3.select(this)
  //   //     .transition()
  //   //     .duration(200)
  //   //     .attr('r', 6)
  //   // })
  //   // .on('mouseout', function () {
  //   //   d3.select(this)
  //   //     .transition()
  //   //     .duration(200)
  //   //     .attr('r', 5)
  //   // })
  //   // .on('click', function (d) { console.log(d.NO_SEQ_COLL) })
  //   // .on('click', function (d) { console.log('Test') })
}
},{}],"JClV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineTooltip = defineTooltip;
exports.defineXScale = defineXScale;
exports.defineYScale = defineYScale;
exports.drawBars = drawBars;
exports.drawPercentageChart = drawPercentageChart;
exports.drawXAxis = drawXAxis;
exports.drawYAxis = drawYAxis;
exports.generateG = generateG;
exports.getDimensions = getDimensions;
exports.getDistinctCount = getDistinctCount;
exports.resetBarClick = resetBarClick;
exports.setBarClick = setBarClick;
/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 * @param {*} colorScale The color scaled used to determine the color of the circles
 */
function drawPercentageChart(data, colorScale) {
  document.querySelectorAll('.percentagechart')[0].style.height = d3.select('#Card').node().getBoundingClientRect().height - 10;
  var dimension = getDimensions();
  var margin = {
    top: 65,
    right: 50,
    bottom: 35,
    left: 155
  };
  var graphSize = dimension; // setSizing(margin)

  // Preprocess the data
  var graviteList = data.map(function (arr) {
    return arr.GRAVITE;
  }); // Keep the Gravity column only
  var rowCount = graviteList.length;
  var graviteCount = getDistinctCount(graviteList, rowCount);

  // Prepare the visual
  var xScale = defineXScale(rowCount, graphSize.width - margin.left - margin.right);
  var yScale = defineYScale(graviteCount, graphSize.height - margin.top - margin.bottom);
  var g = generateG(margin);

  // Draw the visual
  drawXAxis(g, xScale, graphSize.height - margin.top - margin.bottom);
  drawYAxis(g, yScale);
  drawBars(graviteCount, xScale, yScale, colorScale);
}

/**
 * Draws the button to toggle the display year.
 *
 * @returns {number} dimensions
 */
function getDimensions() {
  var parentNode = d3.select('#PercentageChart').node().getBoundingClientRect();
  var containerDimension = {
    width: parentNode.width,
    height: parentNode.height
  };
  return containerDimension;
}

/**
 * Description
 *
 * @param {number} graviteList The data to be used
 * @param {number} rowCount The array length
 * @returns {object[]} The grouped data
 */
function getDistinctCount(graviteList, rowCount) {
  var graviteCount = graviteList.reduce(function (a, c) {
    return a[c] = (a[c] || 0) + 1, a;
  }, {});
  graviteCount = Object.keys(graviteCount).map(function (key) {
    return {
      GRAVITE: key,
      Count: graviteCount[key],
      Ratio: graviteCount[key] / rowCount
    };
  });
  graviteCount = graviteCount.sort(function (a, b) {
    return a.Count - b.Count;
  });
  return graviteCount;
}

/**
 * Sets the domain and range of the X scale.
 *
 * @param {number} rowCount Category list The data to be used
 * @param {number} width The width of the graph
 * @returns {Element} The x axis scale
 */
function defineXScale(rowCount, width) {
  return d3.scaleLinear().domain([0, rowCount]).range([0, width]);
}

/**
 * Sets the domain and range of the Y scale.
 *
 * @param {number} graviteList The data to be used
 * @param {number} heigth The width of the graph
 * @returns {Element} The y axis scale
 */
function defineYScale(graviteList, heigth) {
  graviteList = graviteList.map(function (arr) {
    return arr.GRAVITE;
  });
  return d3.scaleBand()
  // .padding(0.15)
  .domain(graviteList).range([heigth, 0]);
}

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
function generateG(margin) {
  d3.selectAll('#graph-g').remove();
  d3.selectAll('.title').remove();
  d3.selectAll('.title2').remove();
  return d3.select('#PercentageChart').append('g').attr('id', 'graph-g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

/**
 * Draws the x axis at the bottom of the plot.
 *
 * @param {Element} g Base element
 * @param {*} xScale The scale to use for the x axis
 * @param {number} height The height of the graph
 */
function drawXAxis(g, xScale, height) {
  g.append('g').attr('class', 'x.axis').attr('transform', 'translate(0, ' + height + ')').call(d3.axisBottom(xScale).tickFormat(function (x) {
    return x.toLocaleString('en-US');
  }).ticks(5).tickSize(-height));
}

/**
 * Draws the y axis at the left of the plot.
 *
 * @param {Element} g Base element
 * @param {*} yScale The scale to use for the y axis
 */
function drawYAxis(g, yScale) {
  g.append('g').attr('class', 'y.axis').call(d3.axisLeft(yScale));
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} xScale The graph's x scale
 * @param {*} yScale The graph's y scale
 * @param {*} colorScale The graph'x color scale
 */
function drawBars(data, xScale, yScale, colorScale) {
  var clickArray = [];
  var tooltip = defineTooltip();

  // Title
  d3.select('#PercentageChart').append('text').text('Proportion des types d\'accidents').attr('class', 'title').style('font-size', '16px').attr('transform', 'translate(15, 25)').attr('dy', '0em');
  d3.select('#PercentageChart').append('text').text('Interagissez avec le graphique à l\'aide de votre souris en le survolant ou en cliquant sur plusieures barres').attr('class', 'title2').style('font-size', '10px').attr('transform', 'translate(15, 25)').attr('dy', '1.5em').attr('opacity', 0.3);

  // Define group for bars
  var g = d3.select('#graph-g').append('g').attr('class', 'bar-groups')
  // .attr('id', d => `g-${d.GRAVITE}`)
  .selectAll('g').data(data).enter().append('g').attr('id', function (d) {
    return 'bar-g-' + d.GRAVITE;
  });

  // Background Bars
  g.append('rect').attr('class', 'bars')
  // .attr('id', function (d) { return d.GRAVITE })
  .attr('id', function (d) {
    return 'bar-negrect-' + d.GRAVITE;
  })
  // .attr('width', d => xScale((d.Count / d.Ratio) - d.Count))
  .attr('width', function (d) {
    return xScale(d.Count / d.Ratio);
  }).attr('height', 50)
  // .attr('height', d => xScale(d.Count))
  // .attr('x', d => xScale(d.Count))
  .attr('x', 0).attr('y', function (d) {
    return yScale(d.GRAVITE);
  }).attr('fill', '#EDF3FA').on('mouseover', function (event, d) {
    tooltip.style('display', 'block').text((d.Ratio * 100).toFixed(1) + '%');
  }).on('mousemove', function (event) {
    tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 25 + 'px');
  }).on('mouseout', function () {
    tooltip.style('display', 'none').style('opacity', 1);
  }).on('click', function (d) {
    if (clickArray.length >= 2) {
      clickArray = resetBarClick();
    } else {
      clickArray = setBarClick(d, clickArray);
    }
    d3.select('#bar-g-arrow').on('click', function () {
      clickArray = resetBarClick();
    });
  });

  // Bars
  g.append('rect').attr('class', 'bars')
  // .attr('id', function (d) { return d.GRAVITE })
  .attr('id', function (d) {
    return 'bar-rect-' + d.GRAVITE;
  }).attr('width', function (d) {
    return xScale(d.Count);
  }).attr('height', 50)
  // .attr('height', (d) => yScale(data[1].GRAVITE - data[0].GRAVITE))
  .attr('x', 0).attr('y', function (d) {
    return yScale(d.GRAVITE);
  }).attr('fill', function (d) {
    return colorScale(d.GRAVITE);
  }).on('mouseover', function (event, d) {
    tooltip.style('display', 'block').text((d.Ratio * 100).toFixed(1) + '%');
  }).on('mousemove', function (event) {
    tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 25 + 'px');
  }).on('mouseout', function () {
    tooltip.style('display', 'none').style('opacity', 1);
  }).on('click', function (d) {
    if (clickArray.length >= 2) {
      clickArray = resetBarClick();
    } else {
      clickArray = setBarClick(d, clickArray);
    }
    d3.select('#bar-g-arrow').on('click', function () {
      clickArray = resetBarClick();
    });
  });

  // Labels
  g.append('text').attr('class', 'h2').attr('id', function (d) {
    return 'bar-label-' + d.GRAVITE;
  }).text(function (d) {
    return d.Count.toLocaleString('fr-CA');
  }).attr('x', function (d) {
    return xScale(d.Count);
  }).attr('y', function (d) {
    return yScale(d.GRAVITE);
  }).attr('transform', 'translate(5, ' + 50 / 2 + ')').attr('fill', 'black').attr('pointer-events', 'none');
}

/**
 * Draws the y axis at the left of the plot.
 *
 * @returns {*} The d3 Selection for the created g element
 */
function resetBarClick() {
  var transitionTime = 200;
  d3.select('#foreground-rect').transition().duration(transitionTime).attr('opacity', 0).remove();
  d3.select('#bar-g-arrow').attr('opacity', 1).transition().duration(transitionTime).attr('opacity', 0).remove();
  return [];
}

/**
 * Draws the y axis at the left of the plot.
 *
 * @param {object[]} d Rectangles info
 * @param {object[]} clickArray Rectangles info
 * @returns {object[]} d Rectangles info
 */
function setBarClick(d, clickArray) {
  // Keep data from selection
  var dataContainer = d.target.__data__;
  var textLabel = d3.select("text[id='bar-label-".concat(dataContainer.GRAVITE, "']"));

  // Populate rectangle array
  clickArray.push({
    Value: dataContainer.Count,
    Gravite: dataContainer.GRAVITE,
    Position: [textLabel.attr('x'), textLabel.attr('y')],
    Height: d3.select("rect[id='bar-rect-".concat(dataContainer.GRAVITE, "']")).attr('height')
  });

  // Process the message
  if (clickArray.length === 2) {
    // Process the message to display
    var maxCount = Math.max(clickArray[0].Value, clickArray[1].Value);
    var minCount = Math.min(clickArray[0].Value, clickArray[1].Value);
    var diff = (maxCount / minCount).toFixed(1);
    var message = clickArray[0].Value < clickArray[1].Value ? diff + 'x plus bas' : diff + 'x plus élevé';

    // Keep some variables for later on
    var maxX = Math.max(clickArray[0].Position[0], clickArray[1].Position[0]);
    var minY = Math.min(clickArray[0].Position[1], clickArray[1].Position[1]);
    var diffY = Math.abs(clickArray[0].Position[1] - clickArray[1].Position[1]);
    var xTranslate = 55;
    var transitionTime = 200;

    // Create a group for the arrow+text
    var arrowGroup = d3.select('.bar-groups').append('g').attr('id', 'bar-g-arrow');

    // Add Background/Foreground Rectangle to display between the chart and the arrow
    d3.select('#bar-g-arrow').append('rect').attr('id', 'foreground-rect').attr('width', d3.select('.bar-groups').node().getBoundingClientRect().width * 1.1).attr('height', d3.select('.bar-groups').node().getBoundingClientRect().height * 1.1).attr('fill', 'white').attr('transform', 'translate(-1, -10)').transition().duration(transitionTime).attr('opacity', 0.6);

    // Arrow Path
    var curve = d3.line().curve(d3.curveBumpX);
    var midPoint = [maxX + diffY / 2, minY + diffY / 2];
    var points = [clickArray[0].Position, midPoint, clickArray[1].Position];
    arrowGroup.append('path').attr('id', 'arrowPath').attr('d', curve(points)).attr('transform', "translate(".concat(xTranslate, ",", 20, ")")).attr('fill', 'transparent').attr('stroke', 'black').transition().duration(transitionTime).attr('opacity', 1);

    // Arrow Head
    arrowGroup.append('text').text('◄').attr('font-size', 12).attr('x', clickArray[1].Position[0]).attr('y', clickArray[1].Position[1]).attr('text-anchor', 'left').attr('transform', "translate(".concat(xTranslate - 9, ", 25)")).attr('fill', 'black').transition().duration(transitionTime).attr('opacity', 1);

    // Arrow Text
    arrowGroup.append('text').text(message).attr('x', midPoint[0]).attr('y', midPoint[1]).attr('text-anchor', 'left').attr('transform', "translate(".concat(xTranslate + 5, ", ").concat(20 + 5, ")")).attr('fill', 'black').transition().duration(transitionTime).attr('opacity', 1);
  }
  return clickArray;
}

/**
 * Draws the y axis at the left of the plot.
 *
 * @returns {*} The d3 Selection for the created g element
 */
function defineTooltip() {
  d3.selectAll('.tooltip').remove();
  return d3.select('body').append('div').attr('class', 'tooltip').style('position', 'absolute').style('display', 'none').style('pointer-events', 'none').style('background', 'rgba(0, 0, 0, 0.7)').style('color', 'white').style('padding', '10px').style('border-radius', '5px');
}
},{}],"iqW9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawCard = drawCard;
exports.getBestYear = getBestYear;
exports.getCardSideDimension = getCardSideDimension;
exports.getTotalCountAccident = getTotalCountAccident;
exports.getWorstYear = getWorstYear;
exports.getYearlyAverage = getYearlyAverage;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 */
function drawCard(data) {
  var insideMargin = 10;
  var cardDimension = getCardSideDimension(insideMargin);
  document.querySelectorAll('.cardcontainer')[0].style.height = cardDimension * 2.1;
  drawPercentageCard(getTotalCountAccident(data), [0, 0], cardDimension, insideMargin);
  drawPercentageCard(getYearlyAverage(data), [1, 0], cardDimension, insideMargin);
  drawPercentageCard(getBestYear(data), [0, 1], cardDimension, insideMargin);
  drawPercentageCard(getWorstYear(data), [1, 1], cardDimension, insideMargin);

  /**
   * Sets up the click handler for the button.
   *
   * @param {object[]} data Accident data
   * @param {object[]} position card position
   * @param {object[]} cardDimension card position
   * @param {object[]} insideMargin card position
   */
  function drawPercentageCard(data, position, cardDimension, insideMargin) {
    // Group
    var element = d3.selectAll('#Card').append('g').attr('id', 'Card-g-' + position[0].toString() + position[1].toString());

    // Rectangle
    element.append('rect').attr('x', (cardDimension + insideMargin) * position[0]).attr('y', (cardDimension + insideMargin) * position[1]).attr('width', cardDimension).attr('height', cardDimension).attr('fill', '#f5f9fd').attr('rx', '15');

    // KPI Value
    element.append('text')
    // .attr('class', 'cardValue')
    .text(data.Value).attr('x', (cardDimension + insideMargin) * position[0]).attr('y', (cardDimension + insideMargin) * position[1]).attr('transform', "translate(".concat(cardDimension / 2, ",").concat(cardDimension / 2, ")")).attr('text-anchor', 'middle').attr('font-size', 36).attr('font-weight', 'bold');

    // Text Value
    element.append('text')
    // .attr('class', 'cardDetail')
    .attr('x', (cardDimension + insideMargin) * position[0]).attr('y', (cardDimension + insideMargin) * position[1]).attr('transform', "translate(".concat(cardDimension / 2, ",").concat(cardDimension * 0.75, ")")).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 'regular').text(data.Message).attr('dy', '0em');

    // 2nd Text Value
    element.append('text')
    // .attr('class', 'cardDetail')
    .attr('x', (cardDimension + insideMargin) * position[0]).attr('y', (cardDimension + insideMargin) * position[1]).attr('transform', "translate(".concat(cardDimension / 2, ",").concat(cardDimension * 0.75, ")")).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 'regular').text(data.Message2).attr('dy', '1.5em');
  }
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {number} margin inside margin
 * @returns {number} dimensions
 */
function getCardSideDimension(margin) {
  var parentNode = d3.select('#Card').node();
  var totalWidth = parentNode.getBoundingClientRect().width;
  return (totalWidth - margin) / 2;
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {object[]} data inside margin
 * @returns {object[]} dimensions
 */
function getTotalCountAccident(data) {
  var returnArray = {
    Value: data.length.toLocaleString('fr-CA'),
    Message: 'Total d\'accidents'
  };
  return returnArray;
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {object[]} data inside margin
 * @returns {object[]} dimensions
 */
function getWorstYear(data) {
  // Group by
  var yearList = data.map(function (arr) {
    return arr.Year;
  });
  var yearCount = yearList.reduce(function (a, c) {
    return a[c] = (a[c] || 0) + 1, a;
  }, {});
  yearCount = Object.keys(yearCount).map(function (key) {
    return {
      Year: key,
      Count: yearCount[key]
    };
  }).sort(function (a, b) {
    return b.Count - a.Count;
  });
  var returnArray = {
    Value: yearCount[0].Year,
    Message: 'Pire année,',
    Message2: "avec ".concat(yearCount[0].Count.toLocaleString('fr-CA'), " accidents")
  };
  return returnArray;
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {object[]} data inside margin
 * @returns {object[]} dimensions
 */
function getBestYear(data) {
  // Group by
  var yearList = data.map(function (arr) {
    return arr.Year;
  });
  var yearCount = yearList.reduce(function (a, c) {
    return a[c] = (a[c] || 0) + 1, a;
  }, {});
  yearCount = Object.keys(yearCount).map(function (key) {
    return {
      Year: key,
      Count: yearCount[key]
    };
  }).sort(function (a, b) {
    return a.Count - b.Count;
  });
  var returnArray = {
    Value: yearCount[0].Year,
    Message: 'Meilleure année,',
    Message2: "avec ".concat(yearCount[0].Count.toLocaleString('fr-CA'), " accidents")
  };
  return returnArray;
}

/**
 * Draws the button to toggle the display year.
 *
 * @param {object[]} data inside margin
 * @returns {object[]} dimensions
 */
function getYearlyAverage(data) {
  var yearCount = _toConsumableArray(new Set(data.map(function (i) {
    return i.Year;
  }))).length;
  var accidentCount = data.length;
  var returnArray = {
    Value: Math.round(accidentCount / yearCount).toLocaleString('fr-CA'),
    Message: 'Moyenne par année'
  };
  return returnArray;
}
},{}],"Focm":[function(require,module,exports) {
'use strict';

var preproc = _interopRequireWildcard(require("./scripts/preprocess.js"));
var button = _interopRequireWildcard(require("./scripts/buttons.js"));
var map = _interopRequireWildcard(require("./scripts/visuals/Map.js"));
var dotmap = _interopRequireWildcard(require("./scripts/visuals/DotMap.js"));
var percchart = _interopRequireWildcard(require("./scripts/visuals/PercentageChart.js"));
var card = _interopRequireWildcard(require("./scripts/visuals/Card.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import * as helper from './scripts/helper.js'
// import * as viz from './scripts/viz.js'

/**
 * @file This file is the entry-point for the the code our final project for the course INF8808E.
 * @author Mamadou Saliou Diallo, Maxim Laurin, Nina Cussa
 * @version v1.0.0
 */

(function (d3) {
  build();

  /**
   *   This function builds the graph.
   */
  function build() {
    var projection = map.getProjection();
    var path = map.getPath(projection);

    // var borough
    d3.json('./montreal.json').then(function (borough) {
      borough = preproc.reverseGeoJsonCoordinates(borough);
      // map.drawMap(borough, path)

      d3.csv('./collisions_routieres (cleaned).csv', function (d) {
        return {
          NO_SEQ_COLL: d.NO_SEQ_COLL,
          DT_ACCDN: d3.timeParse('%Y-%m-%d')(d.DT_ACCDN),
          HEURE_ACCDN: d.HEURE_ACCDN,
          GRAVITE: d.GRAVITE,
          LOC_LONG: +d.LOC_LONG,
          LOC_LAT: +d.LOC_LAT
        };
      }).then(function (data) {
        // Process the data
        preproc.addDateAttributes(data);
        data = preproc.replaceValues(data);
        preproc.setCoordinates(data, projection);
        // Get distinct values from specific fields
        var distinctYear = preproc.getDistinctYear(data);
        var distinctGravite = preproc.getDistinctGravite(data);
        var distinctFilters = distinctYear.concat(distinctGravite);
        // preproc.addBoroughs(data, borough)
        // Draw visuals
        buildVisuals(data);
        button.drawButton(distinctYear, 'Années');
        button.drawButton(distinctGravite, 'Niveau de gravité');
        setClickHandler();
        /**
         * Sets up the click handler for the button.
         *
         * @param {object[]} data Accident data
         *
         */
        function buildVisuals(data) {
          var colorGravite = preproc.defineColorScaleGravity();
          card.drawCard(data);
          percchart.drawPercentageChart(data, colorGravite);
        }

        /**
         *   Sets up the click handler for the button.
         */
        function setClickHandler() {
          d3.selectAll('.button').on('click', function (event, d) {
            if (!(distinctFilters.length === 1 && distinctFilters[0] === d)) {
              // Can't unselect them all
              if (!distinctFilters.includes(d)) {
                distinctFilters.push(d);
              } else {
                distinctFilters.splice(distinctFilters.indexOf(d), 1);
              }

              // Change color
              var buttonRect = d3.select("rect[id='button-rect-".concat(d, "']"));
              buttonRect.attr('fill', function (d) {
                return buttonRect.attr('fill') === '#33333' ? '#EAEAEA' : '#33333';
              });
              var buttonText = d3.select("text[id='button-text-".concat(d, "']"));
              buttonText.attr('fill', function (d) {
                return buttonText.attr('fill') === '#fff' ? '#33333' : '#fff';
              });

              // Rebuild visuals
              var dataFiltered = data.filter(function (row) {
                return distinctFilters.includes(row.Year) && distinctFilters.includes(row.GRAVITE);
              });
              buildVisuals(dataFiltered);
            }
          });
        }
      });
    });
  }
})(d3);
},{"./scripts/preprocess.js":"LFDw","./scripts/buttons.js":"tPCs","./scripts/visuals/Map.js":"VMO8","./scripts/visuals/DotMap.js":"bs3w","./scripts/visuals/PercentageChart.js":"JClV","./scripts/visuals/Card.js":"iqW9"}]},{},["Focm"], null)
//# sourceMappingURL=/src.88db10ab.js.map