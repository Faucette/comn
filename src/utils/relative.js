var filePath = require("@nathanfaucett/file_path"),
    ensureRelative = require("./ensureRelative");


module.exports = relative;


function relative(dir, path) {
    return ensureRelative(filePath.relative(dir, path));
}
