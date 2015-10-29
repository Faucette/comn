var a = require("./a"),
    log;


var button = document.getElementById("button");


button.onclick = function onClick() {
    require.async("./ab", function(ab) {
        var abc = require("./abc");

        if (ab() === "ab") {
            log(abc());
        }
    });
    require.async("./ab", function(ab) {
        log(ab());
    });
};

process.nextTick(function() {
    log(a());
});

log = require("./log");
log(a());
