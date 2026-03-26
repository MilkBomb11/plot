import { Err } from "./error";
import { Token } from "./token";

function tokenize(source:string) : Token.t[] {
    let start: number = 0;
    let current: number = 0;
    const tokens: Token.t[] = [];

    const keywords: Map<string, (loc: number) => Token.t> = new Map()
        .set("x", Token.X)
        .set("y", Token.Y)
        .set("e", Token.E)
        .set("pi", Token.Pi)
        .set("log", Token.Log)
        .set("sin", Token.Sin)
        .set("cos", Token.Cos)
        .set("tan", Token.Tan)
        .set("sqrt", Token.Sqrt)

    function advance() : string { return source[current++]; }

    function peek() : string { return source[current]; }

    function isAtEnd() : boolean { return current >= source.length; }

    function isAlpha(c: string) : boolean {
        const charCode = c.charCodeAt(0);
        return charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)
            || charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)
            || charCode === '_'.charCodeAt(0);
    }

    function isDigit(c: string) : boolean {
        const charCode = c.charCodeAt(0);
        return charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0);
    }

    function isAlphaNumerical(c: string) : boolean { return isAlpha(c) || isDigit(c); }

    function handleNumber() {
        while (!isAtEnd() && isDigit(peek())) { advance(); }
        if (!isAtEnd() && peek() === '.') { advance(); }
        else {
            const value: number = parseFloat(source.slice(start, current));
            tokens.push(Token.Num(start, value));
            return;
        }
        while (!isAtEnd() && isDigit(peek())) { advance(); }
        const value: number = parseFloat(source.slice(start, current));
        tokens.push(Token.Num(start, value));
    }

    function handleIdentifier() {
        while (!isAtEnd() && isAlphaNumerical(peek())) {advance();}
        const id: string = source.slice(start, current);
        const f = keywords.get(id);
        if (f === undefined) { throw Err.LexErr(start, `Unknown identifier '${id}'.`); }
        tokens.push(f(start));
    }

    function tokenize_one() {
        const c = advance();
        switch (c) {
            case '(': tokens.push(Token.LParen(start)); break;
            case ')': tokens.push(Token.RParen(start)); break;
            case '+': tokens.push(Token.Plus(start)); break;
            case '-': tokens.push(Token.Minus(start)); break;
            case '*': tokens.push(Token.Star(start)); break;
            case '/': tokens.push(Token.Slash(start)); break;
            case '^': tokens.push(Token.Hat(start)); break;
            case ',': tokens.push(Token.Comma(start)); break;
            case '=': tokens.push(Token.Equal(start)); break;
            case ' ': case '\t': case '\n': case '\r': break;
            default: {
                if (isDigit(c)) { handleNumber(); }
                else if (isAlpha(c)) { handleIdentifier(); }
                else { throw Err.LexErr(current, `Unexpected token '${c}'.`); }
            }
        }
    }

    while (!isAtEnd()) {
        start = current;
        tokenize_one();
    }
    tokens.push(Token.Eof(start));
    return tokens;
}

export { tokenize }


