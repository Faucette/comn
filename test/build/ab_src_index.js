__COMN_DEFINE__(3, [
[3, function(require, exports, module, undefined, global) {

var a = require(1),
    b = require(4);


module.exports = ab;


function ab() {
    return a() + b();
}


}],
[4, function(require, exports, module, undefined, global) {

module.exports = b;


function b() {
    return "b";
}


}],
[5, function(require, exports, module, undefined, global) {

var ab = require(3);


module.exports = abc;


function abc() {
    return ab() + "c";
}


}]]);
