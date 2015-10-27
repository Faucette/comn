(function(dependencies, chunks, undefined, global) {
    var cache = [];


    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, undefined, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    
    require.async = function async(index, callback) {
        var module = cache[index],
            node;

        if (module !== undefined) {
            callback(module.exports);
        } else {
            node = document.createElement("script");

            node.type = "text/javascript";
            node.charset = "utf-8";
            node.async = true;
            node.setAttribute("data-module", index);

            function onScriptLoad(e) {
                var node = e.currentTarget || e.srcElement,
                    index = node.getAttribute("data-module");

                callback(require(index));
            }

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0)) {
                node.attachEvent("onreadystatechange", onScriptLoad);
            } else {
                node.addEventListener("load", onScriptLoad, false);
            }

            node.src = chunks[index];

            document.head.appendChild(node);
        }
    };

    global.__COMN_DEFINE__ = function __COMN_DEFINE__(index, deps) {
        var i = -1,
            il = deps.length - 1,
            dep;

        while (i++ < il) {
            dep = deps[i];
            dependencies[dep[0]] = dep[1];
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

var process = require(1);
var a = require(2),
    log;


require.async(4, function(ab) {
    var abc = require(6);

    if (ab() === "ab") {
        log(abc());
    }
});

process.nextTick(function() {
    log(a());
});

log = require(3);
log(a());


},
function(require, exports, module, undefined, global) {

// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};


},
function(require, exports, module, undefined, global) {

module.exports = a;


function a() {
    return "a";
}


},
function(require, exports, module, undefined, global) {

module.exports = log;


function log() {
    console.log.apply(console, arguments);
}


}], {
    "4": "build/ab_src_index.js"
}, void(0), (new Function("return this;"))()));
