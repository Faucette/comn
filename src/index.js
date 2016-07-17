var resolve = require("@nathanfaucett/resolve"),

    filePath = require("@nathanfaucett/file_path"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    extend = require("@nathanfaucett/extend"),

    DependencyTree = require("@nathanfaucett/dependency_tree"),
    getDependencyId = require("@nathanfaucett/dependency_tree/src/utils/getDependencyId"),

    relative = require("./utils/relative"),
    render = require("./utils/render"),
    renderChunk = require("./utils/renderChunk"),

    Comn = require("./Comn"),
    builtin = require("./builtin");


var reBuffer = /\bBuffer\b/,
    reProcess = /\bprocess\b/,

    reFilename = /\b__filename\b|\bmodule\.filename\b|\bmodule\.id\b/,
    reDirname = /\b__dirname\b|\bmodule\.dirname\b/;


module.exports = comn;


function comn(indexPath, options) {
    var emptyPath = builtin._empty,
        out, tree, dirname, reInclude;

    options = options || {};

    options.sourceMaps = options.sourceMaps === true;
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

    out = new Comn(tree);

    dirname = filePath.dirname(tree.fullPath);
    reInclude = tree.options.reInclude;

    tree.parse();

    arrayForEach(tree.chunks, function forEachChunk(chunk, index) {
        var outChunk = out.add(chunk);

        outChunk.name = rename(chunk.fullPath, chunk.rootDirname, options);

        replacePaths(tree, chunk.dependencies, reInclude, options);

        if (index === 0) {
            outChunk.source = render(
                out.id,
                tree.dependencies.length,
                chunk.dependencies,
                mapChunks(tree.chunks, dirname, options),
                options.parseAsync,
                tree.dirname,
                options
            );
        } else {
            outChunk.source = renderChunk(
                out.id,
                chunk.dependencies[0].index,
                chunk.dependencies,
                tree.dirname,
                options
            );
        }
    });

    return out;
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

    options.throwError = false;
    arrayForEach(dependencies, function forEachDependency(dependency) {
        options.mappings = dependency.mappings;
        dependency.content = dependency.content.replace(reInclude,
            function onReplace(match, includeName, functionName, dependencyPath) {
                var resolved = resolve(dependencyPath, dependency.fullPath, options),
                    resolvedModule = resolved && resolved.pkg ? resolved : dependency.module,
                    id = resolved ? getDependencyId(resolved, resolvedModule) : false,
                    dep = id ? dependencyHash[id] : false;

                if (functionName === "resolve") {
                    if (!dep) {
                        return match;
                    } else {
                        return replaceString(match, dependencyPath, relative(dependency.rootDirname, resolved.fullPath));
                    }
                } else {
                    if (!dep) {
                        return match;
                    } else {
                        return replaceString(match, dependencyPath, dep.index, true);
                    }
                }
            }
        );
    });
    options.throwError = true;
}

function mapChunks(chunks, dirname, options) {
    var out = {};

    arrayForEach(chunks.slice(1), function forEachChunk(chunk) {
        out[chunk.dependencies[0].index] = rename(chunk.fullPath, chunk.rootDirname, options);
    });

    return out;
}

function rename(fullPath, rootDirname, options) {
    if (options.rename) {
        return options.rename(filePath.relative(rootDirname, fullPath), fullPath, rootDirname, options);
    } else {
        return filePath.relative(rootDirname, fullPath).replace("/", "_");
    }

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
