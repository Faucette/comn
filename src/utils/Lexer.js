var EOF = {},
    LexerPrototype;


module.exports = Lexer;


function Lexer(source) {
    this.source = source;
    this.index = 0;
    this.length = source.length;
    this.line = 1;
    this.column = 1;
}
LexerPrototype = Lexer.prototype;

Lexer.EOF = LexerPrototype.EOF = EOF;

LexerPrototype.next = function() {
    var ch;

    if (this.index < this.length) {
        ch = this.source[this.index++];

        switch (ch) {
            case '\n':
            case '\r':
                this.line += 1;
                this.column = 1;
                break;
            default:
                this.column += 1;
        }

        return ch;
    } else {
        return EOF;
    }
};

LexerPrototype.peak = function() {
    return this.peakIndex(0);
};

LexerPrototype.peakIndex = function(i) {
    var index = this.index + i;

    if (index < this.length) {
        return this.source[index];
    } else {
        return EOF;
    }
};