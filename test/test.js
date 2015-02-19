var fs = require("fs"),
    comn = require("../src/index");


describe("comn(index : FilePath String, options : Object)", function() {
    it("should compile dependencies into one file", function() {
        var out = comn(__dirname + "/lib/index", {
            exportName: "lib"
        });

        fs.writeFileSync(__dirname + "/lib/dest/index.min.js", out);
    });
});
