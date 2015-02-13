var fs = require("fs"),
    filePath = require("file_path"),
    comn = require("../src/index");


describe("comn(index : FilePath String, options : Object)", function() {
    it("should compile dependencies into one file", function() {
        var out = comn(__dirname + "/lib/index", {
            renameModule: function(filename) {
                var ext = filePath.ext(filename),
                    name = filePath.base(filename, ext);
                return "dest/" + name + ".min.js";
            },
            exportName: "lib"
        });

        fs.writeFileSync(__dirname + "/lib/dest/index.min.js", out);
    });
});
