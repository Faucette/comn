#!/usr/bin/env node

var comn = require(".."),
    isString = require("@nathanfaucett/is_string"),
    filePath = require("@nathanfaucett/file_path"),
    fileUtils = require("@nathanfaucett/file_utils"),
    argv = require("@nathanfaucett/argv");


var options = argv({
    file: ["f", "start file", "string"],
    out: ["o", "out directory/file", "string"],
    ignore: ["i", "ignore paths", "array"],
    parseAsync: ["a", "parse async require statements", "boolean"],
    exportName: ["e", "export to global scope", "string"]
}).parse();

if (!options.file) {
    throw new Error("input file require");
}
if (!options.out) {
    throw new Error("out file require");
}

var out = comn(options.file, {
    exportName: options.exportName,
    parseAsync: options.parseAsync,
    ignore: options.ignore
});

if (out.chunks.length === 1) {
    fileUtils.writeFileSync(options.out, out.chunks[0].source);
} else {
    out.each(function each(chunk) {
        fileUtils.writeFileSync(filePath.join(options.out, chunk.name), chunk.source);
    });
}
