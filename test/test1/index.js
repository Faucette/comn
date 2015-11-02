var eventListener = require("event_listener");


eventListener.on(window, "load", function onLoad() {
    require.async("has", function(has) {
        var a = require("./a"),
            ab = require("./ab");

        console.log(a(), ab(), has({}, "key"));
    });
});
