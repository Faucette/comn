(function(dependencies, chunks, undefined, global) {

    var cache = [],
        cacheCallbacks = {},
        nodes = [];


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

            node.id = "__comn-module-" + index + "__";
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.async = true;

            function onLoad() {
                var i = -1,
                    il = callbacks.length - 1;

                nodes.splice(indexOfNode(node), 1);

                while (i++ < il) {
                    callbacks[i](require(index));
                }
            }

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0)) {
                node.attachEvent("onreadystatechange", onLoad);
            } else {
                node.addEventListener("load", onLoad, false);
            }

            nodes[nodes.length] = node;
            node.src = chunks[index];

            document.head.appendChild(node);
        }
    };

    function indexOfNode(node) {
        var i = -1,
            il = nodes.length - 1;

        while (i++ < il) {
            if (nodes[i] === node) {
                return i;
            }
        }

        return -1;
    }

    global.__COMN_DEFINE__ = function(node, asyncDependencies) {
        var i, il, dependency, index;

        if (indexOfNode(node) !== -1) {
            i = -1;
            il = asyncDependencies.length - 1;

            while (i++ < il) {
                dependency = asyncDependencies[i];
                index = dependency[0];

                if (dependencies[index] === null) {
                    dependencies[index] = dependency[1];
                }
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
        /* ../../node_modules/process/browser.js */

        // shim for using process in browser

        var process = module.exports = {};
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
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
            var timeout = setTimeout(cleanUpNextTick);
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
            clearTimeout(timeout);
        }

        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                setTimeout(drainQueue, 0);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
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

        process.binding = function(name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function() {
            return '/'
        };
        process.chdir = function(dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function() {
            return 0;
        };


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
    null
], {
    "4": "build0/ab_src_index.js"
}, void(0), (new Function("return this;"))()));
