var fs = require("fs"),
    tape = require("tape"),
    filePath = require("file_path"),
    comn = require("..");

tape("comn(index : FilePath String, options : Object) some basic asynv chunks", function(assert) {
    var out = comn(filePath.join(__dirname, "test0", "index.js"), {
            rename: function rename(path, relative /*, dirname, options */ ) {
                return filePath.join("build0", relative.replace(/\/|\\/g, "_"));
            }
        }),
        key;

    if (typeof(out) === "string") {
        fs.writeFileSync(filePath.join(__dirname, "build0", "index.js"), out);
    } else {
        for (key in out) {
            fs.writeFileSync(filePath.join(__dirname, key), out[key]);
        }
    }

    assert.end();
});

tape("comn(index : FilePath String, options : Object) cyclic async deps", function(assert) {
    var out = comn(filePath.join(__dirname, "test1", "index.js"), {
            rename: function rename(path, relative /*, dirname, options */ ) {
                return filePath.join("build1", relative.replace(/\/|\\/g, "_"));
            }
        }),
        key;

    if (typeof(out) === "string") {
        fs.writeFileSync(filePath.join(__dirname, "build1", "index.js"), out);
    } else {
        for (key in out) {
            fs.writeFileSync(filePath.join(__dirname, key), out[key]);
        }
    }

    assert.end();
});

tape("comn(index : FilePath String, options : Object)", function(assert) {
    var out = comn("socket.io-client", {
        exportName: "io"
    });

    fs.writeFileSync(filePath.join(__dirname, "build0", "socket_io-client.js"), out);

    assert.end();
});
