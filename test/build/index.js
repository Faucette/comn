(function(dependencies, chunks, undefined, global) {
    
    var cache = [],
        cacheCallbacks = {};
    

    function Module() {
        this.id = null;
        this.filename = null;
        this.dirname = null;
        this.exports = {};
        this.loaded = false;
    }

    Module.prototype.require = require;

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];

            cache[index] = module = new Module();
            exports = module.exports;

            callback.call(exports, require, exports, module, undefined, global);
            module.loaded = true;

            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    
    require.async = function async(index, callback) {
        var module = cache[index],
            callbacks, node;

        if (module) {
            callback(module.exports);
        } else if ((callbacks = cacheCallbacks[index])) {
            callbacks[callbacks.length] = callback;
        } else {
            node = document.createElement("script");
            callbacks = cacheCallbacks[index] = [callback];

            node.type = "text/javascript";
            node.charset = "utf-8";
            node.async = true;
            node.setAttribute("data-module", index);

            function onLoad() {
                var i = -1,
                    il = callbacks.length - 1;

                while (i++ < il) {
                    callbacks[i](require(index));
                }
            }

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0)) {
                node.attachEvent("onreadystatechange", onLoad);
            } else {
                node.addEventListener("load", onLoad, false);
            }

            node.src = chunks[index];

            document.head.appendChild(node);
        }
    };

    global.__COMN_DEFINE__ = function __COMN_DEFINE__(asyncDependencies) {
        var i = -1,
            il = asyncDependencies.length - 1,
            dependency, index;

        while (i++ < il) {
            dependency = asyncDependencies[i];
            index = dependency[0];

            if (dependencies[index] === null) {
                dependencies[index] = dependency[1];
            }
        }
    };
    

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, undefined, global) {
/* index.js */

var process = require(1);
var a = require(2),
    log;


var button = document.getElementById("button");


button.onclick = function onClick() {
    require.async(4, function(ab) {
        var abc = require(6);

        if (ab() === "ab") {
            log(abc());
        }
    });
    require.async(4, function(ab) {
        log(ab());
    });
};

process.nextTick(function() {
    log(a());
});

log = require(3);
log(a());


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/src/browser.js */

var EventEmitter = require(7),
    environment = require(8),
    asap = require(9),
    now = require(10);


var window = environment.window,
    navigator = window.navigator,
    location = window.location,

    reArch = /\b(?:AMD|IA|Win|WOW|x86_|x)[32|64]+\b/i,
    rePlatform = /[ \s]+/,

    ProcessPrototype;


function Process() {

    EventEmitter.call(this, -1);

    this.pid = 0;
    this.browser = true;
    this.title = "browser";
    this.env = {};
    this.argv = [];
    this.version = "1.0.0";
    this.versions = {};
    this.config = {};
    this.execPath = ".";
    this.execArgv = [];
    this.arch = getArch();
    this.platform = getPlatform();
    this.maxTickDepth = 1000;
    this.__cwd = location ? location.pathname : "/";
}
EventEmitter.extend(Process);
ProcessPrototype = Process.prototype;

function Memory(rss, heapTotal, heapUsed) {
    this.rss = rss;
    this.heapTotal = heapTotal;
    this.heapUsed = heapUsed;
}

ProcessPrototype.memoryUsage = (function() {
    var performance = window.performance || {};

    performance.memory || (performance.memory = {});

    return function memoryUsage() {
        return new Memory(
            performance.memory.jsHeapSizeLimit || 0,
            performance.memory.totalJSHeapSize || 0,
            performance.memory.usedJSHeapSize || 0
        );
    };
}());

ProcessPrototype.nextTick = asap;

ProcessPrototype.cwd = function() {
    return this.__cwd;
};

ProcessPrototype.chdir = function(dir) {
    var cwd = location ? location.pathname : "/",
        length, newDir;

    if (dir === "/") {
        newDir = "/";
    } else {
        length = cwd.length;
        newDir = dir.length >= length ? dir : dir.substring(0, length) + "/";
    }

    if (cwd.indexOf(newDir) === 0) {
        this.__cwd = dir;
    } else {
        throw new Error("process.chdir can't change to directory " + dir);
    }
};

ProcessPrototype.hrtime = function(previousTimestamp) {
    var clocktime = now() * 1e-3,
        seconds = clocktime | 0,
        nanoseconds = ((clocktime % 1) * 1e9) | 0;

    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];

        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }

    return [seconds, nanoseconds];
};

ProcessPrototype.uptime = function() {
    return now() * 1e-3;
};

ProcessPrototype.abort = function() {
    throw new Error("process.abort is not supported");
};

ProcessPrototype.binding = function() {
    throw new Error("process.binding is not supported");
};

ProcessPrototype.umask = function() {
    throw new Error("process.umask is not supported");
};

ProcessPrototype.kill = function() {
    throw new Error("process.kill is not supported");
};

ProcessPrototype.initgroups = function() {
    throw new Error("process.initgroups is not supported");
};

ProcessPrototype.setgroups = function() {
    throw new Error("process.setgroups is not supported");
};

ProcessPrototype.getgroups = function() {
    throw new Error("process.getgroups is not supported");
};

ProcessPrototype.getuid = function() {
    throw new Error("process.getuid is not supported");
};

ProcessPrototype.setgid = function() {
    throw new Error("process.setgid is not supported");
};

ProcessPrototype.getgid = function() {
    throw new Error("process.getgid is not supported");
};

ProcessPrototype.exit = function() {
    throw new Error("process.exit is not supported");
};

ProcessPrototype.setuid = function() {
    throw new Error("process.setuid is not supported");
};

ProcessPrototype.stderr = null;
ProcessPrototype.stdin = null;
ProcessPrototype.stdout = null;


function getArch() {
    if (navigator && navigator.userAgent) {
        return ((reArch.exec(navigator.userAgent) || "")[0] || "unknown").replace(/86_/i, "").toLowerCase();
    } else {
        return "unknown";
    }
}

function getPlatform() {
    if (navigator && navigator.platform) {
        return (navigator.platform.split(rePlatform)[0] || "unknown").toLowerCase();
    } else {
        return "unknown";
    }
}


module.exports = new Process();


},
function(require, exports, module, undefined, global) {
/* a.js */

module.exports = a;


function a() {
    return "a";
}


},
function(require, exports, module, undefined, global) {
/* log/index.js */

module.exports = log;


function log() {
    console.log.apply(console, arguments);
}


},
null,
null,
null,
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/src/index.js */

var isFunction = require(11),
    inherits = require(12),
    fastSlice = require(13),
    keys = require(14),
    isNullOrUndefined = require(15);


var EventEmitterPrototype;


module.exports = EventEmitter;


function EventEmitter(maxListeners) {
    this.__events = {};
    this.__maxListeners = isNullOrUndefined(maxListeners) ? +maxListeners : EventEmitter.defaultMaxListeners;
}
EventEmitterPrototype = EventEmitter.prototype;

EventEmitterPrototype.on = function(name, listener) {
    var events, eventList, maxListeners;

    if (!isFunction(listener)) {
        throw new TypeError("EventEmitter.on(name, listener) listener must be a function");
    }

    events = this.__events || (this.__events = {});
    eventList = (events[name] || (events[name] = []));
    maxListeners = this.__maxListeners || -1;

    eventList[eventList.length] = listener;

    if (maxListeners !== -1 && eventList.length > maxListeners) {
        console.error(
            "EventEmitter.on(type, listener) possible EventEmitter memory leak detected. " + maxListeners + " listeners added"
        );
    }

    return this;
};

EventEmitterPrototype.addEventListener = EventEmitterPrototype.addListener = EventEmitterPrototype.on;

EventEmitterPrototype.once = function(name, listener) {
    var _this = this;

    function once() {

        _this.off(name, once);

        switch (arguments.length) {
            case 0:
                return listener();
            case 1:
                return listener(arguments[0]);
            case 2:
                return listener(arguments[0], arguments[1]);
            case 3:
                return listener(arguments[0], arguments[1], arguments[2]);
            case 4:
                return listener(arguments[0], arguments[1], arguments[2], arguments[3]);
            default:
                return listener.apply(null, arguments);
        }
    }

    this.on(name, once);

    return once;
};

EventEmitterPrototype.listenTo = function(value, name) {
    var _this = this;

    if (!value || !(isFunction(value.on) || isFunction(value.addListener))) {
        throw new TypeError("EventEmitter.listenTo(value, name) value must have a on function taking (name, listener[, ctx])");
    }

    function handler() {
        _this.emitArgs(name, arguments);
    }

    value.on(name, handler);

    return handler;
};

EventEmitterPrototype.off = function(name, listener) {
    var events = this.__events || (this.__events = {}),
        eventList, event, i;

    eventList = events[name];
    if (!eventList) {
        return this;
    }

    if (!listener) {
        i = eventList.length;

        while (i--) {
            this.emit("removeListener", name, eventList[i]);
        }
        eventList.length = 0;
        delete events[name];
    } else {
        i = eventList.length;

        while (i--) {
            event = eventList[i];

            if (event === listener) {
                this.emit("removeListener", name, event);
                eventList.splice(i, 1);
            }
        }

        if (eventList.length === 0) {
            delete events[name];
        }
    }

    return this;
};

EventEmitterPrototype.removeEventListener = EventEmitterPrototype.removeListener = EventEmitterPrototype.off;

EventEmitterPrototype.removeAllListeners = function() {
    var events = this.__events || (this.__events = {}),
        objectKeys = keys(events),
        i = -1,
        il = objectKeys.length - 1,
        key, eventList, j;

    while (i++ < il) {
        key = objectKeys[i];
        eventList = events[key];

        if (eventList) {
            j = eventList.length;

            while (j--) {
                this.emit("removeListener", key, eventList[j]);
                eventList.splice(j, 1);
            }
        }

        delete events[key];
    }

    return this;
};

function emit(eventList, args) {
    var a1, a2, a3, a4, a5,
        length = eventList.length - 1,
        i = -1,
        event;

    switch (args.length) {
        case 0:
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event();
                }
            }
            break;
        case 1:
            a1 = args[0];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1);
                }
            }
            break;
        case 2:
            a1 = args[0];
            a2 = args[1];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2);
                }
            }
            break;
        case 3:
            a1 = args[0];
            a2 = args[1];
            a3 = args[2];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2, a3);
                }
            }
            break;
        case 4:
            a1 = args[0];
            a2 = args[1];
            a3 = args[2];
            a4 = args[3];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2, a3, a4);
                }
            }
            break;
        case 5:
            a1 = args[0];
            a2 = args[1];
            a3 = args[2];
            a4 = args[3];
            a5 = args[4];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2, a3, a4, a5);
                }
            }
            break;
        default:
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event.apply(null, args);
                }
            }
            break;
    }
}

EventEmitterPrototype.emitArgs = function(name, args) {
    var eventList = (this.__events || (this.__events = {}))[name];

    if (!eventList || !eventList.length) {
        return this;
    }

    emit(eventList, args);

    return this;
};

EventEmitterPrototype.emit = function(name) {
    return this.emitArgs(name, fastSlice(arguments, 1));
};

function createFunctionCaller(args) {
    switch (args.length) {
        case 0:
            return function functionCaller(fn) {
                return fn();
            };
        case 1:
            return function functionCaller(fn) {
                return fn(args[0]);
            };
        case 2:
            return function functionCaller(fn) {
                return fn(args[0], args[1]);
            };
        case 3:
            return function functionCaller(fn) {
                return fn(args[0], args[1], args[2]);
            };
        case 4:
            return function functionCaller(fn) {
                return fn(args[0], args[1], args[2], args[3]);
            };
        case 5:
            return function functionCaller(fn) {
                return fn(args[0], args[1], args[2], args[3], args[4]);
            };
        default:
            return function functionCaller(fn) {
                return fn.apply(null, args);
            };
    }
}

function emitAsync(eventList, args, callback) {
    var length = eventList.length,
        index = 0,
        called = false,
        functionCaller;

    function next(err) {
        if (called !== true) {
            if (err || index === length) {
                called = true;
                callback(err);
            } else {
                functionCaller(eventList[index++]);
            }
        }
    }

    args[args.length] = next;
    functionCaller = createFunctionCaller(args);
    next();
}

EventEmitterPrototype.emitAsync = function(name, args, callback) {
    var eventList = (this.__events || (this.__events = {}))[name];

    args = fastSlice(arguments, 1);
    callback = args.pop();

    if (!isFunction(callback)) {
        throw new TypeError("EventEmitter.emitAsync(name [, ...args], callback) callback must be a function");
    }

    if (!eventList || !eventList.length) {
        callback();
    } else {
        emitAsync(eventList, args, callback);
    }

    return this;
};

EventEmitterPrototype.listeners = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];
    return eventList ? eventList.slice() : [];
};

EventEmitterPrototype.listenerCount = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];
    return eventList ? eventList.length : 0;
};

EventEmitterPrototype.setMaxListeners = function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    this.__maxListeners = value < 0 ? -1 : value;
    return this;
};

inherits.defineProperty(EventEmitter, "defaultMaxListeners", 10);

inherits.defineProperty(EventEmitter, "listeners", function(value, name) {
    var eventList;

    if (isNullOrUndefined(value)) {
        throw new TypeError("EventEmitter.listeners(value, name) value required");
    }
    eventList = value.__events && value.__events[name];

    return eventList ? eventList.slice() : [];
});

inherits.defineProperty(EventEmitter, "listenerCount", function(value, name) {
    var eventList;

    if (isNullOrUndefined(value)) {
        throw new TypeError("EventEmitter.listenerCount(value, name) value required");
    }
    eventList = value.__events && value.__events[name];

    return eventList ? eventList.length : 0;
});

inherits.defineProperty(EventEmitter, "setMaxListeners", function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    EventEmitter.defaultMaxListeners = value < 0 ? -1 : value;
    return value;
});

EventEmitter.extend = function(child) {
    inherits(child, this);
    return child;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/environment/src/index.js */

var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.worker = typeof(importScripts) !== "undefined";

environment.browser = environment.worker || !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.worker && !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/asap/src/browser.js */

var hasWindow = typeof(window) !== "undefined",
    BrowserMutationObserver = hasWindow && (window.MutationObserver || window.WebKitMutationObserver),
    asap;


if (BrowserMutationObserver) {
    asap = (function createMutationObserver() {
        var node = document.createTextNode(""),
            index = 0,
            queue = [],
            observer = new BrowserMutationObserver(function onChange() {
                var fn;

                if (queue.length > 0) {
                    fn = queue.shift();
                    fn();
                }
            });

        observer.observe(node, {
            characterData: true
        });

        return function asap(fn) {
            queue[queue.length] = fn;
            index = (index + 1) % 2;
            node.data = index;
        };
    }());
} else if (hasWindow && window.setImmediate) {
    asap = function asap(fn) {
        window.setImmediate(fn);
    };
} else if (hasWindow && window.postMessage && window.addEventListener) {
    asap = (function createMessageEventListener() {
        var queue = [];

        window.addEventListener("message", function onMessage(event) {
            var source = event.source;

            if ((source === window || source === null) && event.data === "__ASAP_MESSAGE__") {
                event.stopPropagation();

                if (queue.length > 0) {
                    queue.shift()();
                }
            }
        }, true);

        return function asap(fn) {
            queue[queue.length] = fn;
            window.postMessage("__ASAP_MESSAGE__", "*");
        };
    }());
} else if (hasWindow && window.setTimeout) {
    asap = function asap(fn) {
        window.setTimeout(fn, 0);
    };
} else {
    asap = function asap() {
        throw new Error("asap(fn) is not available in this environment");
    };
}


module.exports = asap;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/now/src/browser.js */

var Date_now = Date.now || function Date_now() {
        return (new Date()).getTime();
    },
    START_TIME = Date_now(),
    performance = global.performance || {};


function now() {
    return performance.now();
}

performance.now = (
    performance.now ||
    performance.webkitNow ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    function now() {
        return Date_now() - START_TIME;
    }
);

now.getStartTime = function getStartTime() {
    return START_TIME;
};


START_TIME -= now();


module.exports = now;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/is_function/src/index.js */

var objectToString = Object.prototype.toString,
    isFunction;


if (objectToString.call(function() {}) === "[object Object]") {
    isFunction = function isFunction(value) {
        return value instanceof Function;
    };
} else if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(value) {
        return objectToString.call(value) === "[object Function]";
    };
} else {
    isFunction = function isFunction(value) {
        return typeof(value) === "function" || false;
    };
}


module.exports = isFunction;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/src/index.js */

var create = require(16),
    extend = require(17),
    mixin = require(18),
    defineProperty = require(19);


var descriptor = {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null
};


module.exports = inherits;


function inherits(child, parent) {

    mixin(child, parent);

    if (child.__super) {
        child.prototype = extend(create(parent.prototype), child.__super, child.prototype);
    } else {
        child.prototype = extend(create(parent.prototype), child.prototype);
    }

    defineNonEnumerableProperty(child, "__super", parent.prototype);
    defineNonEnumerableProperty(child.prototype, "constructor", child);

    child.defineStatic = defineStatic;
    child.super_ = parent;

    return child;
}
inherits.defineProperty = defineNonEnumerableProperty;

function defineNonEnumerableProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function defineStatic(name, value) {
    defineNonEnumerableProperty(this, name, value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/fast_slice/src/index.js */

var clamp = require(30),
    isNumber = require(31);


module.exports = fastSlice;


function fastSlice(array, offset) {
    var length = array.length,
        newLength, i, il, result, j;

    offset = clamp(isNumber(offset) ? offset : 0, 0, length);
    i = offset - 1;
    il = length - 1;
    newLength = length - offset;
    result = new Array(newLength);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/keys/src/index.js */

var has = require(27),
    isNative = require(21),
    isNullOrUndefined = require(15),
    isObject = require(28);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/is_null_or_undefined/src/index.js */

var isNull = require(20),
    isUndefined = require(24);


module.exports = isNullOrUndefined;

/**
  isNullOrUndefined accepts any value and returns true
  if the value is null or undefined. For all other values
  false is returned.
  
  @param {Any}        any value to test
  @returns {Boolean}  the boolean result of testing value

  @example
    isNullOrUndefined(null);   // returns true
    isNullOrUndefined(undefined);   // returns true
    isNullOrUndefined("string");    // returns false
**/
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/src/index.js */

var isNull = require(20),
    isNative = require(21),
    isPrimitive = require(22);


var nativeCreate = Object.create;


module.exports = create;


function create(object) {
    return nativeCreate(isPrimitive(object) ? null : object);
}

if (!isNative(nativeCreate)) {
    nativeCreate = function nativeCreate(object) {
        var newObject;

        function F() {
            this.constructor = F;
        }

        if (isNull(object)) {
            newObject = new F();
            newObject.constructor = newObject.__proto__ = null;
            delete newObject.__proto__;
            return newObject;
        } else {
            F.prototype = object;
            return new F();
        }
    };
}


module.exports = create;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/extend/src/index.js */

var keys = require(14);


module.exports = extend;


function extend(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseExtend(out, arguments[i]);
    }

    return out;
}

function baseExtend(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];
        a[key] = b[key];
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/mixin/src/index.js */

var keys = require(14),
    isNullOrUndefined = require(15);


module.exports = mixin;


function mixin(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseMixin(out, arguments[i]);
    }

    return out;
}

function baseMixin(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key, value;

    while (i++ < il) {
        key = objectKeys[i];

        if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
            a[key] = value;
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/define_property/src/index.js */

var isObject = require(28),
    isFunction = require(11),
    isPrimitive = require(22),
    isNative = require(21),
    has = require(27);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_null/src/index.js */

module.exports = isNull;


function isNull(value) {
    return value === null;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_native/src/index.js */

var isFunction = require(11),
    isNullOrUndefined = require(15),
    escapeRegExp = require(23);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        escapeRegExp(Object.prototype.toString)
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject;


module.exports = isNative;


function isNative(value) {
    return !isNullOrUndefined(value) && (
        isFunction(value) ?
        reNative.test(functionToString.call(value)) : (
            typeof(value) === "object" && (
                (isHostObject(value) ? reNative : reHostCtor).test(value) || false
            )
        )
    ) || false;
}

try {
    String({
        "toString": 0
    } + "");
} catch (e) {
    isHostObject = function isHostObject() {
        return false;
    };
}

isHostObject = function isHostObject(value) {
    return !isFunction(value.toString) && typeof(value + "") === "string";
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_primitive/src/index.js */

var isNullOrUndefined = require(15);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_native/node_modules/escape_regexp/src/index.js */

var toString = require(25);


var reRegExpChars = /[.*+?\^${}()|\[\]\/\\]/g,
    reHasRegExpChars = new RegExp(reRegExpChars.source);


module.exports = escapeRegExp;


function escapeRegExp(string) {
    string = toString(string);
    return (
        (string && reHasRegExpChars.test(string)) ?
        string.replace(reRegExpChars, "\\$&") :
        string
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/is_null_or_undefined/node_modules/is_undefined/src/index.js */

module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_native/node_modules/escape_regexp/node_modules/to_string/src/index.js */

var isString = require(26),
    isNullOrUndefined = require(15);


module.exports = toString;


function toString(value) {
    if (isString(value)) {
        return value;
    } else if (isNullOrUndefined(value)) {
        return "";
    } else {
        return value + "";
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/inherits/node_modules/create/node_modules/is_native/node_modules/escape_regexp/node_modules/to_string/node_modules/is_string/src/index.js */

module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/keys/node_modules/has/src/index.js */

var isNative = require(21),
    getPrototypeOf = require(29),
    isNullOrUndefined = require(15);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        return nativeHasOwnProp.call(object, key);
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/keys/node_modules/is_object/src/index.js */

var isNull = require(20);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNull(value) && type === "object") || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/keys/node_modules/has/node_modules/get_prototype_of/src/index.js */

var isObject = require(28),
    isNative = require(21),
    isNullOrUndefined = require(15);


var nativeGetPrototypeOf = Object.getPrototypeOf,
    baseGetPrototypeOf;


module.exports = getPrototypeOf;


function getPrototypeOf(value) {
    if (isNullOrUndefined(value)) {
        return null;
    } else {
        return baseGetPrototypeOf(value);
    }
}

if (isNative(nativeGetPrototypeOf)) {
    baseGetPrototypeOf = function baseGetPrototypeOf(value) {
        return nativeGetPrototypeOf(isObject(value) ? value : Object(value)) || null;
    };
} else {
    if ("".__proto__ === String.prototype) {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.__proto__ || null;
        };
    } else {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.constructor ? value.constructor.prototype : null;
        };
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/fast_slice/node_modules/clamp/src/index.js */

module.exports = clamp;


function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/process/node_modules/event_emitter/node_modules/fast_slice/node_modules/is_number/src/index.js */

module.exports = isNumber;


function isNumber(value) {
    return typeof(value) === "number" || false;
}


}], {
    "4": "build/ab_src_index.js"
}, void(0), (new Function("return this;"))()));
