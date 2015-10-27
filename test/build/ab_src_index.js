__COMN_DEFINE__(4, [
[4, function(require, exports, module, undefined, global) {

var a = require(2),
    b = require(5);


module.exports = ab;


function ab() {
    return a() + b();
}


}],
[5, function(require, exports, module, undefined, global) {

module.exports = b;


function b() {
    return "b";
}


}],
[6, function(require, exports, module, undefined, global) {

var ab = require(4);


module.exports = abc;


function abc() {
    return ab() + "c";
}


}]]);
