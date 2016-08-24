var fs = require("fs"),
    template = require("@nathanfaucett/template"),
    trim = require("@nathanfaucett/trim"),
    arrayMap = require("@nathanfaucett/array-map"),
    filePath = require("@nathanfaucett/file_path"),
    renderDependency = require("./renderDependency");


var renderTemplate = template(fs.readFileSync(filePath.join(__dirname, "..", "template.ejs")).toString("utf-8"));


module.exports = render;


function render(id, length, dependencies, chunks, parseAsync, dirname, options) {
    return renderTemplate({
        id: id,
        dependencies: "[\n" + arrayMap(copyDependencies(dependencies, length), function render(dependency) {
            if (dependency) {
                return renderDependency(dependency, dirname, options);
            } else {
                return "null";
            }
        }).join(",\n") + "]",
        parseAsync: parseAsync,
        chunks: chunks ? JSON.stringify(chunks, null, 4) : "null",
        exportName: trim(options.exportName ? options.exportName + "" : "")
    });
}

function copyDependencies(dependencies, length) {
    var result = new Array(length),
        i = -1,
        il = dependencies.length - 1,
        dependency;

    while (i++ < il) {
        dependency = dependencies[i];
        result[dependency.index] = dependency;
    }

    return result;
}