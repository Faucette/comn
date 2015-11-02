var fs = require("fs"),

    resolve = require("resolve"),
    isNodeModule = require("resolve/src/utils/isNodeModule"),

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


function comn(indexPath, options) {
    var emptyPath = builtin._empty,
        tree, dirname, reInclude, out;

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

    tree.parse();

    if (tree.chunks.length === 1) {
        replacePaths(tree, tree.dependencies, reInclude, options);
        return render(tree.dependencies.length, tree.dependencies, null, false, options, tree.dirname);
    } else {
        out = {};

        arrayForEach(tree.chunks, function forEachChunk(chunk, index) {

            replacePaths(tree, chunk.dependencies, reInclude, options);

            if (index === 0) {
                out[rename(chunk.fullPath, dirname, options)] = render(tree.dependencies.length, chunk.dependencies, mapChunks(tree.chunks, dirname, options), options.parseAsync, options, tree.dirname);
            } else {
                out[rename(chunk.fullPath, dirname, options)] = renderChunk(chunk.dependencies[0].index, chunk.dependencies, tree.dirname);
            }
        });

        return out;
    }
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
                resolvedModule = resolved.pkg ? resolved : dependency.module,
                id = resolved ? getDependencyId(resolved, resolvedModule) : false,
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
    var ext = filePath.extname(relative);
    return (filePath.dirname(relative).replace(/\./g, "_") + "/" + filePath.basename(relative, ext) + ext).replace(/\//g, "_");
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
        tree = dependency.chunk.tree,
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
            relativePath = relative(filePath.dirname(tree.fullPath), fullPath);
            content = includeFilename + relativePath + newline + content;
        }
        if (reDirname.test(content)) {
            relativeDir = filePath.dir(relativePath || relative(filePath.dirname(tree.fullPath), fullPath));
            content = includeDirname + relativeDir + newline + content;
        }

        dependency.content = content;
    }
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

function render(length, dependencies, chunks, parseAsync, options, dirname) {
    return renderTemplate({
        dependencies: "[\n" + arrayMap(copyDependencies(dependencies, length), function render(dependency) {
            if (dependency) {
                return renderDependency(dependency, dirname);
            } else {
                return "null";
            }
        }).join(",\n") + "]",
        parseAsync: parseAsync,
        chunks: chunks ? JSON.stringify(chunks, null, 4) : "null",
        exportName: trim(options.exportName)
    });
}

function renderChunk(index, dependencies, dirname) {
    return renderChunkTemplate({
        index: index,
        dependencies: "[\n" + arrayMap(dependencies, function render(dependency) {
            return renderChunkDependency(dependency, dirname);
        }).join(",\n") + "]"
    });
}

function renderChunkDependency(dependency, dirname) {
    return "[" + dependency.index + ", " + renderDependency(dependency, dirname) + "]";
}

function renderDependency(dependency, dirname) {
    return [
        'function(require, exports, module, undefined, global) {',
        '/* ' + filePath.relative(dirname, dependency.fullPath) + ' */',
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
