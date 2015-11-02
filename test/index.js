var fs = require("fs"),
    tape = require("tape"),
    comn = require("..");

tape("comn(index : FilePath String, options : Object)", function(assert) {
    var out = comn(__dirname + "/test0/index.js", {
            rename: function rename(path, relative /*, dirname, options */ ) {
                return "build0/" + relative.replace(/\//g, "_");
            }
        }),
        path;

    if (typeof(out) === "string") {
        fs.writeFileSync(__dirname + "/build0/index.js", out);
    } else {
        for (path in out) {
            fs.writeFileSync(__dirname + "/" + path, out[path]);
        }
    }

    assert.end();
});

tape("comn(index : FilePath String, options : Object)", function(assert) {
    var out = comn(__dirname + "/test1/index.js", {
            rename: function rename(path, relative /*, dirname, options */ ) {
                return "build1/" + relative.replace(/\//g, "_");
            }
        }),
        path;

    if (typeof(out) === "string") {
        fs.writeFileSync(__dirname + "/build1/index.js", out);
    } else {
        for (path in out) {
            fs.writeFileSync(__dirname + "/" + path, out[path]);
        }
    }

    assert.end();
});

tape("comn(index : FilePath String, options : Object)", function(assert) {
    var out = comn("socket.io-client", {
        exportName: "io"
    });

    fs.writeFileSync(__dirname + "/build0/socket_io-client.js", out);

    assert.end();
});
