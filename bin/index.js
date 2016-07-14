#!/usr/bin/env node

var comn = require(".."),
    isString = require("@nathanfaucett/is_string"),
    fileUtils = require("@nathanfaucett/file_utils"),
    argv = require("@nathanfaucett/argv");


var options = argv({
    file: ["f", "start file", "string"],
    out: ["o", "out directory/file", "string"],
    ignore: ["i", "ignore paths", "array"],
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
    ignore: options.ignore
});

if (isString(out)) {
    fileUtils.writeFileSync(options.out, out);
} else {
    for (var path in out) {
        fileUtils.writeFileSync(options.out + "/" + path, out[path]);
    }
}
