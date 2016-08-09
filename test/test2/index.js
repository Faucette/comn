var object = require("./object");


require.async("@nathanfaucett/is_object", function(isObject) {
    if (isObject(object)) {
        console.log(object);
    }
});

require.async("@nathanfaucett/has", function(has) {
    var object = {
        key: "value"
    };

    if (has(object, "key")) {
        throw new Error("OTHER FILE STACK TRACE");
    }
});

setTimeout(function() {
    throw new Error("STACK TRACE");
}, 1000);
