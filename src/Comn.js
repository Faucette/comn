var uuid = require("@nathanfaucett/uuid");


module.exports = Comn;


function Comn(tree) {
    this.id = uuid();
    this.tree = tree;
    this.chunks = [];
}

Comn.prototype.add = function(treeChunk) {
    var chunks = this.chunks,
        chunk = new ComnChunk(treeChunk);

    chunks[chunks.length] = chunk;

    return chunk;
};

Comn.prototype.each = function(fn) {
    var chunks = this.chunks,
        i = -1,
        il = chunks.length - 1;

    while (i++ < il) {
        if (fn(chunks[i]) === false) {
            return;
        }
    }
};
Comn.prototype.forEach = Comn.prototype.each;

Comn.prototype.generateSourceMaps = function() {
    this.each(function each(chunk) {
        chunk.generateSourceMaps();
    });
};

function ComnChunk(treeChunk) {
    this.name = null;
    this.treeChunk = treeChunk;
    this.source = null;
}
