var fs = require("fs"),
    tape = require("tape"),
    comn = require("..");


tape("comn(index : FilePath String, options : Object, callback: Function)", function(assert) {
    comn(__dirname + "/lib/index.js", {
        rename: function rename(path, relative /*, dirname, options */ ) {
            return "build/" + relative.replace(/\//g, "_");
        }
    }, function onComn(error, out) {
        var path;

        if (error) {
            assert.end(error);
        } else {
            if (typeof(out) === "string") {
                fs.writeFileSync(__dirname + "/build/index.js", out);
            } else {
                for (path in out) {
                    fs.writeFileSync(__dirname + "/" + path, out[path]);
                }
            }
            assert.end();
        }
    });
});

tape("comn(index : FilePath String, options : Object, callback: Function)", function(assert) {
    comn(__dirname + "/socket_io-client.js", {
        exportName: "io"
    }, function onComn(error, out) {
        if (error) {
            assert.end(error);
        } else {
            fs.writeFileSync(__dirname + "/build/socket_io-client.js", out);
            assert.end();
        }
    });
});
