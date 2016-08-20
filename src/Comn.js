var fs = require("fs"),
    convert = require("convert-source-map"),
    combine = require("combine-source-map"),
    uuid = require("@nathanfaucett/uuid"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    filePath = require("@nathanfaucett/file_path"),
    parsePositions = require("./utils/parsePositions");


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

Comn.prototype.entry = function() {
    return this.chunks[0];
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
        chunk.generateSourceMap();
    });
};

function ComnChunk(treeChunk) {
    this.name = null;

    this.treeChunk = treeChunk;
    this.source = null;

    this.sources = null;
    this.sourceMap = null;
    this.positions = null;
}

ComnChunk.prototype.generateSourceMap = function() {
    var sourceMap = this.sourceMap,
        positions, treeChunk, source;

    if (!sourceMap) {
        positions = this.getPositions();
        sources = this.sources = combine.create(this.name);
        treeChunk = this.treeChunk;
        source = this.source;

        arrayForEach(positions, function each(position) {
            var dependency = treeChunk.getDependency(position.id);

            sources.addFile({
                source: fs.readFileSync(dependency.fullPath).toString("utf-8"),
                sourceFile: filePath.relative(treeChunk.rootDirname, dependency.fullPath)
            }, {
                line: position.line,
                column: position.column
            });
        });

        sourceMap = this.sourceMap = convert.fromBase64(sources.base64());
    }

    return sourceMap;
};

ComnChunk.prototype.getPositions = function() {
    var positions = this.positions;

    if (!positions) {
        positions = this.positions = [];
        parsePositions(this.source, this.treeChunk, positions);
    }

    return positions;
};
