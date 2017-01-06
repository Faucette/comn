#!/usr/bin/env node

var comn = require(".."),
    isString = require("@nathanfaucett/is_string"),
    filePath = require("@nathanfaucett/file_path"),
    fileUtils = require("@nathanfaucett/file_utils"),
    argv = require("@nathanfaucett/argv");


var optionDefinitions = {
    file: ["f", "start file", "string"],
    out: ["o", "out directory/file", "string"],
    ignore: ["i", "ignore paths", "array"],
    parseAsync: ["a", "parse async require statements", "boolean"],
    sourceMaps: ["m", "parse source maps", "boolean"],
    sourceMapsDir: ["d", "parse source maps", "string"],
    exportName: ["e", "export to global scope", "string"],
    help: ["h", "show this help information", "boolean"]
};

var options = argv(optionDefinitions).parse();

function printHelp() {

    var fmt = "comn v0.0.13\n",
        v, k;

    
    fmt += "Usage: comn -f [start-file] -o [out-file]\n";
    fmt += "Options:\n\n";

    for(k in optionDefinitions) {

        v = optionDefinitions[k];

        fmt += "-"+v[0]+", --"+k+"\n";
        fmt += "\t"+v[1]+"\n\n";
    }

    fmt += "For bug reporting instructions, please see:\n";
    fmt += "https://github.com/Faucette/comn";

    console.log(fmt);

    process.exit(0);
}

if (options.help) {

    printHelp();

}


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

if (options.sourceMaps) {
    out.generateSourceMaps();
}

var sourceMapsDir = options.sourceMapsDir || "./";


if (out.chunks.length === 1) {
    var entry = out.entry();

    if (options.sourceMaps) {
        fileUtils.writeFileSync(options.out + ".map", entry.sourceMap.toJSON());
        fileUtils.writeFileSync(options.out, entry.source + "\n//# sourceMappingURL=" + filePath.join(sourceMapsDir, filePath.base(options.out)) + ".map");
    } else {
        fileUtils.writeFileSync(options.out, entry.source);
    }
} else {
    if (options.sourceMaps) {
        out.each(function each(chunk) {
            fileUtils.writeFileSync(filePath.join(options.out, chunk.name + ".map"), chunk.sourceMap.toJSON());
            fileUtils.writeFileSync(
                filePath.join(options.out, chunk.name),
                chunk.source + "\n//# sourceMappingURL=" + filePath.join(sourceMapsDir, chunk.name + ".map") + ".map"
            );
        });
    } else {
        out.each(function each(chunk) {
            fileUtils.writeFileSync(filePath.join(options.out, chunk.name), chunk.source);
        });
    }
}
