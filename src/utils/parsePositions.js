var Lexer = require("./Lexer");


var reDependencyId = /\/\*\@\=\-(.+?)\-\=\@\*\//;


module.exports = parsePositions;


function parsePositions(source, treeChunk, positions) {
    var lexer = new Lexer(source),
        ch, matches, id, dependency;

    while ((ch = lexer.next()) !== lexer.EOF) {
        if (ch === '/') {
            matches = getDependencyId(lexer);

            if (matches) {
                id = matches[1];
                dependency = treeChunk.getDependency(id);

                positions[positions.length] = {
                    id: id,
                    startIndex: getStartIndex(dependency.extraLines, lexer),
                    line: lexer.line,
                    column: lexer.column,
                    endIndex: getEndIndex(lexer)
                };
            }
        }
    }
}

function getDependencyId(lexer) {
    var comment = '/',
        ch, matches;

    while ((ch = lexer.next()) !== lexer.EOF) {
        if (ch === '*' && lexer.peak(0) === '/') {
            lexer.next();
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

function getStartIndex(extraLines, lexer) {
    var lines = extraLines + 1,
        ch;

    while ((ch = lexer.next()) !== lexer.EOF) {
        if (ch === '\n' || ch === '\r') {
            lines -= 1;
        }
        if (lines === 0) {
            break;
        }
    }

    return lexer.index;
}

function getEndIndex(lexer) {
    var brackets = 1,
        ch;

    while ((ch = lexer.next()) !== lexer.EOF) {
        if (ch === '}') {
            brackets -= 1;
        } else if (ch === '{') {
            brackets += 1;
        }

        if (brackets === 0) {
            break;
        }
    }

    return lexer.index - 2;
}
