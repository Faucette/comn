__COMN_DEFINE__(document.getElementById("__comn-module-13__"), [
    [13, function(require, exports, module, undefined, global) {
        /* a.js */

        var isObject = require(3);


        var a;


        if (!isObject(null)) {
            a = function a() {
                return "a";
            };
        }


        module.exports = a;


    }],
    [14, function(require, exports, module, undefined, global) {
        /* ab.js */

        module.exports = ab;


        function ab() {
            return "ab";
        }


    }]
]);
