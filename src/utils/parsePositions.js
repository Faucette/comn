var reDependencyId = /\/\*\@\=\-(.+?)\-\=\@\*\//;


module.exports = parsePositions;


function parsePositions(source, treeChunk, positions) {
    var lexer = new Lexer(source),
        ch, matches, id, dependency;

    while (lexer.index < lexer.length) {
        ch = lexer.source[lexer.index++];

        switch (ch) {
            case '/':
                if (lexer.source[lexer.index] === '*') {
                    matches = getDependencyId(lexer);

                    if (matches) {
                        id = matches[1];
                        dependency = treeChunk.getDependency(id);

                        positions[positions.length] = {
                            id: id,
                            line: lexer.line,
                            startIndex: lexer.index + 1,
                            endIndex: getEndIndex(lexer) - 2
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
            lexer.index++;
            comment += "*/";
            break;
        } else {
            comment += ch;
        }
    }

    matches = reDependencyId.exec(comment);

    if (matches) {
        return matches;
    } else {
        return false;
    }
}

function getEndIndex(lexer) {
    var brackets = 1,
        ch;

    while (lexer.index < lexer.length) {
        ch = lexer.source[lexer.index++];

        if (ch === '}') {
            brackets -= 1;
        } else if (ch === '{') {
            brackets += 1;
        }

        if (brackets === 0) {
            break;
        }
    }

    return lexer.index;
}

function Lexer(source) {
    this.source = source;
    this.index = 0;
    this.length = source.length;
    this.line = 1;
    this.column = 1;
}
