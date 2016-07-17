var fs = require("fs"),
    tape = require("tape"),
    filePath = require("@nathanfaucett/file_path"),
    comn = require("..");


tape("comn(index : FilePath String, options : Object) some basic asynv chunks", function(assert) {
    var out = comn(filePath.join(__dirname, "test0", "index.js"), {
        rename: function rename(relativePath /* ,fullPath, rootDirname, options */ ) {
            return filePath.join("build0", relativePath.replace(/\//g, "_"));
        }
    });

    out.each(function(chunk) {
        fs.writeFileSync(filePath.join(__dirname, chunk.name), chunk.source);
    });

    assert.end();
});

tape("comn(index : FilePath String, options : Object) cyclic async deps", function(assert) {
    var out = comn(filePath.join(__dirname, "test1", "index.js"), {
        rename: function rename(relativePath /*, fullPath, rootDirname, options */ ) {
            return filePath.join("build1", relativePath.replace(/\//g, "_"));
        }
    });

    out.each(function(chunk) {
        fs.writeFileSync(filePath.join(__dirname, chunk.name), chunk.source);
    });

    assert.end();
});

tape("comn(index : FilePath String, options : Object)", function(assert) {
    var out = comn("socket.io-client", {
        exportName: "io"
    });

    out.each(function(chunk) {
        fs.writeFileSync(filePath.join(__dirname, "build0", "socket_io-client.js"), chunk.source);
    });

    assert.end();
});
