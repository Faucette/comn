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
// can load node modules or files parses path/to/file into seperate file unless
// the parseAsync option is false
require.async("path/to/file", function(file) {
    console.log(file);
});
```
