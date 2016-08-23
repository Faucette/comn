var tape = require("tape"),
    uglify = require("uglify-js"),
    filePath = require("@nathanfaucett/file_path"),
    fileUtils = require("@nathanfaucett/file_utils"),
    comn = require("..");


tape("comn(index : FilePath String, options : Object) some basic asynv chunks", function(assert) {
    var out = comn(filePath.join(__dirname, "test0", "index.js"), {
        rename: function rename(relativePath /* ,fullPath, rootDirname, options */ ) {
            return filePath.join("build0", relativePath.replace(/\\|\//g, "_"));
        }
    });

    out.generateSourceMaps();

    out.each(function(chunk) {
        fileUtils.writeFileSync(
            filePath.join(__dirname, chunk.name),
            chunk.source + "\n//# sourceMappingURL=data:application/json;base64," + chunk.sourceMap.toBase64()
        );
    });

    assert.end();
});

tape("comn(index : FilePath String, options : Object) cyclic async deps", function(assert) {
    var out = comn(filePath.join(__dirname, "test1", "index.js"), {
        rename: function rename(relativePath /*, fullPath, rootDirname, options */ ) {
            return filePath.join("build1", relativePath.replace(/\\|\//g, "_"));
        }
    });

    out.generateSourceMaps();

    out.each(function(chunk) {
        fileUtils.writeFileSync(filePath.join(__dirname, chunk.name + ".map"), chunk.sourceMap.toJSON());
        fileUtils.writeFileSync(
            filePath.join(__dirname, chunk.name),
            chunk.source + "\n//# sourceMappingURL=../" + chunk.name + ".map"
        );
    });

    assert.end();
});

tape("comn(index : FilePath String, options : Object) should compile browserify modules", function(assert) {
    var out = comn("socket.io-client", {
        exportName: "io"
    });

    out.generateSourceMaps();

    out.each(function(chunk) {
        var jsPath = filePath.join(__dirname, "build0", "socket_io-client.js"),
            jsMapPath = filePath.join(__dirname, "build0", "socket_io-client.js" + ".map"),
            jsMapRelativePath = filePath.join("..", "build0", "socket_io-client.js" + ".map"),
            origSourceMap = chunk.sourceMap.toJSON(),
            sourceMap, result;

        fileUtils.writeFileSync(jsMapPath, origSourceMap);
        fileUtils.writeFileSync(jsPath, chunk.source);

        result = uglify.minify(jsPath, {
            inSourceMap: jsMapPath,
            outSourceMap: jsMapRelativePath,
            sourceMapUrl: jsMapRelativePath,
            sourceMapIncludeSources: true
        });
        sourceMap = JSON.parse(result.map);

        fileUtils.writeFileSync(jsPath, result.code);

        sourceMap.sourcesContent = JSON.parse(origSourceMap).sourcesContent;
        fileUtils.writeFileSync(jsMapPath, JSON.stringify(sourceMap));
    });

    assert.end();
});
