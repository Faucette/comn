#!/usr/bin/env node

var comn = require(".."),
    fileUtils = require("file_utils"),
    argv = require("argv");


var options = argv({
    file: ["f", "start file", "string"],
    out: ["o", "out file", "string"],
    ignore: ["i", "ignore paths", "array"],
    exportName: ["e", "export to global scope", "string"]
}).parse();

if (!options.file) {
    throw new Error("input file require");
}

if (!options.out) {
    throw new Error("out file require");
}

comn(options.file, {
    exportName: options.exportName,
    parseAsync: false,
    ignore: options.ignore
}, function onComn(error, out) {
    if (error) {
        throw error;
    } else {
        fileUtils.writeFile(options.out, out, function onWriteFile(error) {
            if (error) {
                throw error;
            }
        });
    }
})
