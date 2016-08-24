function builtin(name, path, empty) {
    return {
        name: name,
        path: path,
        empty: !!empty
    };
}

exports.assert = builtin("assert", require.resolve('assert/'));
exports.buffer = builtin("buffer", require.resolve('buffer/'));
exports.child_process = builtin(null, require.resolve('./_empty.js'), true);
exports.cluster = builtin(null, require.resolve('./_empty.js'), true);
exports.console = builtin("console-browserify", require.resolve('console-browserify'));
exports.constants = builtin("constants-browserify", require.resolve('constants-browserify'));
exports.crypto = builtin("crypto-browserify", require.resolve('crypto-browserify'));
exports.dgram = builtin(null, require.resolve('./_empty.js'), true);
exports.dns = builtin(null, require.resolve('./_empty.js'), true);
exports.domain = builtin("domain-browser", require.resolve('domain-browser'));
exports.events = builtin("events", require.resolve('events/'));
exports.fs = builtin(null, require.resolve('./_empty.js'), true);
exports.http = builtin("stream-http", require.resolve('stream-http'));
exports.https = builtin("https-browserify", require.resolve('https-browserify'));
exports.module = builtin(null, require.resolve('./_empty.js'), true);
exports.net = builtin(null, require.resolve('./_empty.js'), true);
exports.os = builtin("os-browserify", require.resolve('os-browserify/browser.js'));
exports.path = builtin("path-browserify", require.resolve('path-browserify'));
exports.punycode = builtin("punycode", require.resolve('punycode/'));
exports.querystring = builtin("querystring-es3", require.resolve('querystring-es3/'));
exports.readline = builtin(null, require.resolve('./_empty.js'), true);
exports.repl = builtin(null, require.resolve('./_empty.js'), true);
exports.stream = builtin("stream-browserify", require.resolve('stream-browserify'));
exports._stream_duplex = builtin("readable-stream", require.resolve('readable-stream/duplex.js'));
exports._stream_passthrough = builtin("readable-stream", require.resolve('readable-stream/passthrough.js'));
exports._stream_readable = builtin("readable-stream", require.resolve('readable-stream/readable.js'));
exports._stream_transform = builtin("readable-stream", require.resolve('readable-stream/transform.js'));
exports._stream_writable = builtin("readable-stream", require.resolve('readable-stream/writable.js'));
exports.string_decoder = builtin("string_decoder", require.resolve('string_decoder/'));
exports.sys = builtin("util", require.resolve('util/util.js'));
exports.timers = builtin("timers-browserify", require.resolve('timers-browserify'));
exports.tls = builtin(null, require.resolve('./_empty.js'), true);
exports.tty = builtin("tty-browserify", require.resolve('tty-browserify'));
exports.url = builtin("url", require.resolve('url/'));
exports.util = builtin("util", require.resolve('util/util.js'));
exports.vm = builtin("vm-browserify", require.resolve('vm-browserify'));
exports.zlib = builtin("browserify-zlib", require.resolve('browserify-zlib'));
exports._process = builtin("process", require.resolve('process/browser'));