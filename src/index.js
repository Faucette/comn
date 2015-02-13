var fs = require("fs"),

    filePath = require("file_path"),
    trim = require("trim"),
    template = require("template"),
    map = require("map"),
    forEach = require("for_each"),
    extend = require("extend"),

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


function comn(index, opts) {
    var emptyPath = builtin._empty,
        tree, childHash, rootDirectory, options;

    opts = opts || {};

    opts.extensions = opts.extensions || opts.exts || ["js", "json"];
    opts.ignore = opts.ignore || [];
    opts.builtin = extend({}, opts.builtin || builtin);
    opts.beforeParse = beforeParse;

    if (opts.node) {
        opts.builtin = {};
    }

    forEach(opts.ignore, function(value) {
        opts.builtin[value] = emptyPath;
    });

    tree = parseDependencyTree(index, opts);
    options = tree.options;

    childHash = tree.childHash;
    rootDirectory = tree.rootDirectory;
    options.throwError = false;

    forEach(tree.children, function(dependency) {
        var parentDir = filePath.dir(dependency.fullPath);

        dependency.content = dependency.content.replace(options.reInclude, function(match, includeName, functionName, dependencyPath) {
            var opts = resolve(dependencyPath, parentDir, options),
                id = opts ? (opts.moduleName ? opts.moduleName : opts.fullPath) : false,
                dep = id ? childHash[id] : false;

            if (functionName === "resolve") {
                if (!dep) {
                    return match;
                } else {
                    return replaceString(match, dependencyPath, relative(rootDirectory, opts.fullPath));
                }
            }

            if (!dep) {
                return match;
            }

            return replaceString(match, dependencyPath, dep.index, true);
        });
    });

    return render(tree.children, options);
}

var newline = '";\n',
    includeProcess = 'var process = require("process");\n',
    includeBuffer = 'var Buffer = require("buffer").Buffer;\n',
    includeFilename = 'var __filename = module.id = module.filename = "',
    includeDirname = 'var __dirname =  module.dirname = "';

function beforeParse(content, cleanContent, dependency, tree) {
    var moduleName = dependency.moduleName,
        fullPath = dependency.fullPath,
        relativePath, relativeDir;

    if (filePath.ext(fullPath) === ".json") {
        dependency.isJSON = true;
        dependency.content = content;
        return cleanContent;
    }

    if (moduleName !== "process" && reProcess.test(cleanContent)) {
        content = includeProcess + content;
        cleanContent = includeProcess + cleanContent;
    }
    if (moduleName !== "buffer" && reBuffer.test(cleanContent)) {
        content = includeBuffer + content;
        cleanContent = includeBuffer + cleanContent;
    }
    if (reFilename.test(cleanContent)) {
        relativePath = relative(tree.rootDirectory, fullPath);

        content = includeFilename + relativePath + newline + content;
        cleanContent = includeFilename + relativePath + newline + cleanContent;
    }
    if (reDirname.test(cleanContent)) {
        relativeDir = filePath.dir(relativePath || relative(tree.rootDirectory, fullPath));

        content = includeDirname + relativeDir + newline + content;
        cleanContent = includeDirname + relativeDir + newline + cleanContent;
    }

    dependency.content = content;

    return cleanContent;
}

function render(dependencies, options) {
    return renderTemplate({
        dependencies: "[\n" + map(dependencies, renderDependency).join(",\n") + "]",
        exportName: trim(options.exportName),
        async: options.async
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
