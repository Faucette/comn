comn
=======

comn is a commonjs compiler

```bash
$ comn -f ./path/to/file -o ./path/to/out
```

```javascript
var comn = require("comn");


var out = comn("path/to/index.js", {
    parseAsync: false,
    builtin: {},
    mappings: {},
    packageType: "main"
});

// single file output
fs.writeFileSync("path/to/out/file.js", out.entry().source);

// if parsed async deps
out.each(function(chunk) {
    fs.writeFileSync("path/to/out/file.js", "//# sourceMappingURL=./path/to/sourceMap\n" + chunk.source);
});

// will generate source maps for each entry
out.generateSourceMaps();

out.each(function(chunk) {
    fs.writeFileSync("path/to/out/file.js.map", chunk.sourceMap.toJSON());
});

```

## Async Parsing
```javascript
// can load node modules or files parses path/to/file into separate file unless
// the parseAsync option is false
require.async("path/to/file", function(file) {
    console.log(file);
});
```
