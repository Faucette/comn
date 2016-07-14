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

window.onload = function onLoad() {
    require.async(1, function(has) {
        var a = require(4),
            ab = require(5);

        console.log(a(), ab(), has({}, "key"));
    });
};


},
null,
null,
null,
null,
null,
null,
null], {
    "1": "build1/.._.._node_modules_has_src_index.js"
}, void(0), (new Function("return this;"))()));
