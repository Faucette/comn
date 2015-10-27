var fs = require("fs"),

    resolve = require("resolve"),
    isNodeModule = require("resolve/src/utils/isNodeModule"),

    isFunction = require("is_function"),
    filePath = require("file_path"),
    trim = require("trim"),
    template = require("template"),
    arrayMap = require("array-map"),
    arrayForEach = require("array-for_each"),
    extend = require("extend"),

    DependencyTree = require("dependency_tree"),
    getDependencyId = require("dependency_tree/src/utils/getDependencyId"),

    builtin = require("./builtin");


var renderTemplate = template(fs.readFileSync(__dirname + "/template.ejs").toString("utf-8")),
    renderChunkTemplate = template(fs.readFileSync(__dirname + "/chunk.ejs").toString("utf-8")),

    reBuffer = /\bBuffer\b/,
    reProcess = /\bprocess\b/,

    reFilename = /\b__filename\b|\bmodule\.filename\b|\bmodule\.id\b/,
    reDirname = /\b__dirname\b|\bmodule\.dirname\b/;


module.exports = comn;


function comn(indexPath, options, callback) {
    var emptyPath = builtin._empty,
        out = {},
        tree, dirname, reInclude;

    if (isFunction(options)) {
        callback = options;
        options = {};
    }

    options = options || {};

    options.extensions = options.extensions || options.exts || ["js", "json"];
    options.ignore = options.ignore || [];
    options.builtin = extend({}, builtin, options.builtin);
    options.beforeParse = beforeParse;
    options.packageType = options.packageType || "browser";

    if (options.node) {
        options.builtin = {};
        options.packageType = "main";
    }

    arrayForEach(options.ignore, function(value) {
        options.builtin[value] = emptyPath;
    });

    tree = new DependencyTree(indexPath, options);
    extend(options, tree.options);

    dirname = filePath.dirname(tree.fullPath);
    reInclude = tree.options.reInclude;

    tree.parse(function onParse(error) {
        if (error) {
            callback(error);
        } else {
            if (tree.chunks.length === 1) {
                replacePaths(tree, tree.dependencies, reInclude, options);
                callback(undefined, render(tree.dependencies, null, false, options));
            } else {
                arrayForEach(tree.chunks, function forEachChunk(chunk, index) {

                    replacePaths(tree, chunk.dependencies, reInclude, options);

                    if (index === 0) {
                        out[rename(chunk.fullPath, dirname, options)] = render(chunk.dependencies, mapChunks(tree.chunks, dirname, options), options.parseAsync, options);
                    } else {
                        out[rename(chunk.fullPath, dirname, options)] = renderChunk(chunk.dependencies[0].index, chunk.dependencies);
                    }
                });

                callback(undefined, out);
            }
        }
    });

    return tree;
}

function replaceString(str, oldValue, value, removeQuotes) {
    var index = str.indexOf(oldValue);

    if (removeQuotes) {
        return str.substr(0, index - 1) + value + str.substr(index + oldValue.length + 1);
    } else {
        return str.substr(0, index) + value + str.substr(index + oldValue.length);
    }
}

function replacePaths(tree, dependencies, reInclude, options) {
    var dependencyHash = tree.dependencyHash;

    arrayForEach(dependencies, function forEachDependency(dependency) {
        options.mappings = dependency.mappings;
        dependency.content = dependency.content.replace(reInclude, function onReplace(match, includeName, functionName, dependencyPath) {
            var resolved = resolve(dependencyPath, dependency.fullPath, options),
                id = resolved ? getDependencyId(resolved, isNodeModule(dependencyPath)) : false,
                dep = id ? dependencyHash[id] : false;

            if (functionName === "resolve") {
                if (!dep) {
                    return match;
                } else {
                    return replaceString(match, dependencyPath, relative(rootDirectory, resolved.fullPath));
                }
            } else {
                if (!dep) {
                    return match;
                } else {
                    return replaceString(match, dependencyPath, dep.index, true);
                }
            }
        });
    });
}

function mapChunks(chunks, dirname, options) {
    var out = {};

    arrayForEach(chunks.slice(1), function forEachChunk(chunk) {
        out[chunk.dependencies[0].index] = rename(chunk.fullPath, dirname, options);
    });

    return out;
}

function rename(path, dirname, options) {
    if (options.rename) {
        return options.rename(path, filePath.relative(dirname, path), dirname, options);
    } else {
        return baseRename(filePath.relative(dirname, path));
    }
}

function baseRename(relative) {
    return relative.replace(/\//g, "_");
}

var newline = '";\n',
    includeProcess = 'var process = require("process");\n',
    includeBuffer = 'var Buffer = require("buffer").Buffer;\n',
    includeFilename = 'var __filename = module.id = module.filename = "',
    includeDirname = 'var __dirname = module.dirname = "';

function beforeParse(dependency) {
    var content = dependency.content,
        pkg = dependency.pkg,
        moduleName = pkg && pkg.name,
        fullPath = dependency.fullPath,
        relativePath, relativeDir;

    if (filePath.ext(fullPath) === ".json") {
        dependency.isJSON = true;
        dependency.content = content;
    } else {
        if (moduleName !== "process" && reProcess.test(content)) {
            content = includeProcess + content;
        }
        if (moduleName !== "buffer" && reBuffer.test(content)) {
            content = includeBuffer + content;
        }
        if (reFilename.test(content)) {
            relativePath = relative(tree.rootDirectory, fullPath);
            content = includeFilename + relativePath + newline + content;
        }
        if (reDirname.test(content)) {
            relativeDir = filePath.dir(relativePath || relative(tree.rootDirectory, fullPath));
            content = includeDirname + relativeDir + newline + content;
        }

        dependency.content = content;
    }
}

function render(dependencies, chunks, parseAsync, options) {
    return renderTemplate({
        dependencies: "[\n" + arrayMap(dependencies, renderDependency).join(",\n") + "]",
        parseAsync: parseAsync,
        chunks: chunks ? JSON.stringify(chunks, null, 4) : "null",
        exportName: trim(options.exportName)
    });
}

function renderChunk(index, dependencies) {
    return renderChunkTemplate({
        index: index,
        dependencies: "[\n" + arrayMap(dependencies, renderChunkDependency).join(",\n") + "]"
    });
}

function renderChunkDependency(dependency) {
    return "[" + dependency.index + ", " + renderDependency(dependency) + "]";
}

function renderDependency(dependency) {
    return [
        'function(require, exports, module, undefined, global) {',
        '',
        dependency.isJSON ? 'module.exports = ' + dependency.content + ';' : dependency.content,
        '',
        '}'
    ].join("\n");
}

function ensureRelative(path) {
    return isNodeModule(path) ? "./" + path : path;
}

function relative(dir, path) {
    return ensureRelative(filePath.relative(dir, path));
}
