var fs = require("fs"),
    tape = require("tape"),
    comn = require("..");


tape("comn(index : FilePath String, options : Object)", function(assert) {
    comn(__dirname + "/lib/index.js", {
        rename: function rename(path, base /*, dirname, options */ ) {
            return "build/" + base.replace(/\//g, "_");
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
