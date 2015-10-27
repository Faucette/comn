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

            document.body.appendChild(node);
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

var a = require(1),
    log;


require.async(3, function(ab) {
    var abc = require(5);

    if (ab() === "ab") {
        log(abc());
    }
});


log = require(2);
log(a());


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
    "3": "build/ab_src_index.js"
}, void(0), (new Function("return this;"))()));
