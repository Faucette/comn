var reDependencyId = /\/\*\@\=\-(.+?)\-\=\@\*\//;


module.exports = parsePositions;


function parsePositions(source, treeChunk, positions) {
    var lexer = new Lexer(source),
        ch, id;

    while (lexer.index < lexer.length) {
        ch = lexer.source[lexer.index++];

        switch (ch) {
            case '/':
                if (lexer.source[lexer.index] === '*') {
                    if ((id = getDependencyId(lexer))) {
                        positions[positions.length] = {
                            id: id,
                            line: lexer.line + 1
                        };
                    }
                }
                break;
            case '\n':
            case '\r':
                lexer.line += 1;
                lexer.column = 1;
                break;
            default:
                lexer.column += 1;
        }
    }
}

function getDependencyId(lexer) {
    var comment = '/',
        ch, matches;

    while (lexer.index < lexer.length) {
        ch = lexer.source[lexer.index++];

        if (ch === '*' && lexer.source[lexer.index] === '/') {
            comment += "*/";
            break;
        } else {
            comment += ch;
        }
    }

    matches = reDependencyId.exec(comment);

    if (matches) {
        return matches[1];
    } else {
        return false;
    }
}

function Lexer(source) {
    this.source = source;
    this.index = 0;
    this.length = source.length;
    this.line = 1;
    this.column = 1;
}
