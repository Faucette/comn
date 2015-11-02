var eventListener = require("event_listener");


eventListener.on(window, "load", function onLoad() {
    require.async("./mod", function(mod) {
        console.log(mod(""), mod({}));
    });
});
