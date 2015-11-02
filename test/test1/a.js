var isObject = require("is_object");


var a;


if (!isObject(null)) {
    a = function a() {
        return "a";
    };
}


module.exports = a;
