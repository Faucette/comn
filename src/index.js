var fs = require("fs"),

    filePath = require("file_path"),
    trim = require("trim"),
    template = require("template"),
    map = require("map"),
    forEach = require("for_each"),

    resolve = require("resolve"),
    parseDependencyTree = require("parse_dependency_tree"),

    builtin = require("./builtin");


var helpers = resolve.helpers,
    renderTemplate = template(fs.readFileSync(__dirname + "/template.ejs").toString("utf-8")),

    reBuffer = /\bBuffer\b/,
    reProcess = /\bprocess\b/,

    reFilename = /\b__filename\b|\bmodule\.filename\b|\bmodule\.id\b/,
    reDirname = /\b__dirname\b|\bmodule\.dirname\b/;


module.exports = comn;


function comn(index, options) {
    var graph, array, hash, root;

    options = options || {};
    options.builtin = options.builtin || builtin;
    options.encoding = options.encoding || "utf-8";
    options.beforeParse = beforeParse;

    graph = parseDependencyTree(index, options);

    array = graph.array;
    hash = graph.hash;
    root = graph.root;
    options.throwError = false;

    forEach(array, function(dependency) {
        var parentDir = filePath.dir(dependency.fullPath);

        dependency.content = dependency.content.replace(graph.reInclude, function(match, fnType, dependencyPath) {
            var opts = resolve(dependencyPath, parentDir, options),
                id = opts.moduleName ? opts.moduleName : opts.fullPath,
                dependency = hash[id];

            if (fnType === "require.resolve") {
                if (!dependency) {
                    return match;
                } else {
                    return replaceString(match, dependencyPath, relative(root, opts.fullPath));
                }
            }

            if (!dependency) {
                return match;
            }

            return replaceString(match, dependencyPath, dependency.index, true);
        });
    });

    return render(array, options);
}

var newline = '";\n',
    includeProcess = 'var process = require("process");\n',
    includeBuffer = 'var Buffer = require("buffer").Buffer;\n',
    includeFilename = 'var __filename = module.id = module.filename = "',
    includeDirname = 'var __dirname =  module.dirname = "';

function beforeParse(content, cleanContent, dependency, graph) {
    var moduleName = dependency.moduleName,
        relativePath, relativeDir;

    if (moduleName !== "process" && reProcess.test(cleanContent)) {
        content = includeProcess + content;
        cleanContent = includeProcess + cleanContent;
    }
    if (moduleName !== "buffer" && reBuffer.test(cleanContent)) {
        content = includeBuffer + content;
        cleanContent = includeBuffer + cleanContent;
    }
    if (reFilename.test(cleanContent)) {
        relativePath = relative(graph.root, dependency.fullPath);

        content = includeFilename + relativePath + newline + content;
        cleanContent = includeFilename + relativePath + newline + cleanContent;
    }
    if (reDirname.test(cleanContent)) {
        relativeDir = filePath.dir(relativePath || relative(graph.root, dependency.fullPath));

        content = includeDirname + relativeDir + newline + content;
        cleanContent = includeDirname + relativeDir + newline + cleanContent;
    }

    dependency.content = content;

    return cleanContent;
}

function render(dependencies, options) {
    return renderTemplate({
        dependencies: "[\n" + map(dependencies, renderDependency).join(",\n") + "]",
        exportName: trim(options.exportName)
    });
}

function renderDependency(dependency) {
    return [
        'function(require, exports, module, global) {',
        '',
        dependency.isJSON ? "module.exports = " + dependency.content : dependency.content,
        '',
        '}'
    ].join("\n");
}

function replaceString(str, oldValue, value, removeQuotes) {
    var index = str.indexOf(oldValue);

    if (removeQuotes) {
        return str.substr(0, index - 1) + value + str.substr(index + oldValue.length + 1);
    } else {
        return str.substr(0, index) + value + str.substr(index + oldValue.length);
    }
}

function ensureRelative(path) {
    return helpers.isNotRelative(path) ? "./" + path : path;
}

function relative(dir, path) {
    return ensureRelative(filePath.relative(dir, path));
}
