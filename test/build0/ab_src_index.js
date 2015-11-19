__COMN_DEFINE__(document.getElementById("__comn-module-4__"), [
    [4, function(require, exports, module, undefined, global) {
        /* ab/src/index.js */

        var a = require(2),
            b = require(5);


        module.exports = ab;


        function ab() {
            return a() + b();
        }


    }],
    [5, function(require, exports, module, undefined, global) {
        /* ab/src/b.js */

        module.exports = b;


        function b() {
            return "b";
        }


    }],
    [6, function(require, exports, module, undefined, global) {
        /* abc.js */

        var ab = require(4);


        module.exports = abc;


        function abc() {
            return ab() + "c";
        }


    }]
]);
