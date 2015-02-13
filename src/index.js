var fs = require("fs"),

    filePath = require("file_path"),
    trim = require("trim"),
    template = require("template"),
    map = require("map"),
    forEach = require("for_each"),
    extend = require("extend"),
    isFunction = require("is_function"),

    resolve = require("resolve"),
    parseDependencyTree = require("parse_dependency_tree"),

    builtin = require("./builtin");


var helpers = resolve.helpers,

    renderTemplate = template(fs.readFileSync(__dirname + "/template.ejs").toString("utf-8")),
    renderDefineTemplate = template(fs.readFileSync(__dirname + "/define_template.ejs").toString("utf-8")),

    reBuffer = /\bBuffer\b/,
    reProcess = /\bprocess\b/,

    reFilename = /\b__filename\b|\bmodule\.filename\b|\bmodule\.id\b/,
    reDirname = /\b__dirname\b|\bmodule\.dirname\b/;


module.exports = comn;


function comn(index, options) {
    var results = {},
        emptyPath = builtin._empty,
        graph, modules, hash, root, renameModule;

    options = options || {};

    options.exts = options.exts || ["js", "json"];
    options.ignore = options.ignore || [];
    options.builtin = extend({}, options.builtin || builtin);
    options.encoding = options.encoding || "utf-8";
    options.beforeParse = beforeParse;
    options.parseAsync = options.parseAsync != null ? !!options.parseAsync : true;

    renameModule = options.renameModule = isFunction(options.renameModule) ? options.renameModule : function(value) {
        return value;
    };

    forEach(options.ignore, function(value) {
        options.builtin[value] = emptyPath;
    });

    graph = parseDependencyTree(index, options);

    modules = graph.modules;
    hash = graph.hash;
    root = graph.root;
    options.throwError = false;

    forEach(graph.array, function(dependency) {
        var parentDir = filePath.dir(dependency.fullPath);

        dependency.content = dependency.content.replace(graph.reInclude, function(match, includeName, functionName, dependencyPath) {
            var opts = resolve(dependencyPath, parentDir, options),
                id = opts && (opts.moduleName ? opts.moduleName : opts.fullPath) || false,
                dep = id && hash[id] || false;

            if (functionName === "resolve") {
                if (!dep) {
                    return match;
                } else {
                    return replaceString(match, dependencyPath, relative(root, opts.fullPath));
                }
            }

            if (!dep) {
                return match;
            }

            return replaceString(match, dependencyPath, dep.index, true);
        });
    });

    forEach(modules, function(module) {
        module.moduleFileName = renameModule(module.moduleFileName);
    });

    forEach(modules, function(module, index) {
        if (index === 0) {
            results[module.moduleFileName] = render(modules.slice(1), module.dependencies, options);
        } else {
            results[module.moduleFileName] = renderDefine(module.index, module.dependencies);
        }
    });

    return results;
}

var newline = '";\n',
    includeProcess = 'var process = require("process");\n',
    includeBuffer = 'var Buffer = require("buffer").Buffer;\n',
    includeFilename = 'var __filename = module.id = module.filename = "',
    includeDirname = 'var __dirname =  module.dirname = "';

function beforeParse(content, cleanContent, dependency, graph) {
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
        relativePath = relative(graph.root, fullPath);

        content = includeFilename + relativePath + newline + content;
        cleanContent = includeFilename + relativePath + newline + cleanContent;
    }
    if (reDirname.test(cleanContent)) {
        relativeDir = filePath.dir(relativePath || relative(graph.root, fullPath));

        content = includeDirname + relativeDir + newline + content;
        cleanContent = includeDirname + relativeDir + newline + cleanContent;
    }

    dependency.content = content;

    return cleanContent;
}

function render(modules, dependencies, options) {
    return renderTemplate({
        dependencies: "{\n" + map(dependencies, renderDependency).join(",\n") + "}",
        modules: "{\n" + map(modules, renderModulePath).join(",\n") + "}",
        exportName: trim(options.exportName),
        parseAsync: options.parseAsync
    });
}

function renderDefine(index, dependencies) {
    return renderDefineTemplate({
        index: index,
        dependencies: "{\n" + map(dependencies, renderDependency).join(",\n") + "}"
    });
}

function renderDependency(dependency) {
    return [
        dependency.index + ': function(require, exports, module, global) {',
        '',
        dependency.isJSON ? "module.exports = " + dependency.content : dependency.content,
        '',
        '}'
    ].join("\n");
}

function renderModulePath(dependency) {
    return dependency.index + ': "' + dependency.moduleFileName + '"';
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
