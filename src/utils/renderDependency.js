module.exports = renderDependency;


function renderDependency(dependency /*, dirname, options */ ) {
    return [
        'function(require, exports, module, undefined, global) {',
        '/*' + dependency.id + '*/',
        '',
        dependency.isJSON ? 'module.exports = ' + dependency.content + ';' : dependency.content,
        '',
        '}'
    ].join("\n");
}
