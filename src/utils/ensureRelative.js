var isNodeModule = require("@nathanfaucett/resolve/src/utils/isNodeModule");


module.exports = ensureRelative;


function ensureRelative(path) {
    return isNodeModule(path) ? "." + filePath.separator + path : path;
}