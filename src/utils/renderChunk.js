var fs = require("fs"),
    template = require("@nathanfaucett/template"),
    arrayMap = require("@nathanfaucett/array-map"),
    filePath = require("@nathanfaucett/file_path"),
    renderDependency = require("./renderDependency");


var renderChunkTemplate = template(fs.readFileSync(filePath.join(__dirname, "..", "/chunk.ejs")).toString("utf-8"));


module.exports = renderChunk;


function renderChunk(id, index, dependencies, dirname, options) {
    return renderChunkTemplate({
        id: id,
        index: index,
        dependencies: "[\n" + arrayMap(dependencies, function render(dependency) {
            return renderChunkDependency(dependency, dirname, options);
        }).join(",\n") + "]"
    });
}

function renderChunkDependency(dependency, dirname, options) {
    return "[" + dependency.index + ", " + renderDependency(dependency, dirname, options) + "]";
}