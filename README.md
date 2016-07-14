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
```

## Async Parsing
```javascript
// can load node modules or files
require("path/to/file", function(file) {
    console.log(file);
});
```
