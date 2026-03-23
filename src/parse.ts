import { Err } from "./error";
import { Op } from "./op";
import { Token } from "./token";

function parse(tokens: Token.Token[]) : Op.Op[] {
    let current = 0;
    const opcodes: Op.Op[] = [];

    function advance() : Token.Token { return tokens[current++]; }

    function peek() : Token.Token { return tokens[current]; }

    function peekPrevious() : Token.Token { return tokens[current-1]; }

    function eat(token: Token.Token) {
        if (peek().kind === token.kind) {advance(); return;}
        throw Err.ParseErr(peek().loc, `Expected '${Token.toString(token)}' but got '${Token.toString(peek())}'.`)
    }

    function match(tokens: Token.Token[]) : boolean {
        for (const token of tokens) {
            if (peek().kind === token.kind) {
                advance(); return true;
            }
        }
        return false;
    }
    
    function tokenToBinOp(token: Token.Token) : Op.Op {
        switch (token.kind) {
            case "Plus": return Op.Add(token.loc);
            case "Equal":
            case "Minus": return Op.Sub(token.loc);
            case "Star": return Op.Mul(token.loc);
            case "Slash": return Op.Div(token.loc);
            case "Hat": return Op.Exp(token.loc);
            default: throw Err.ParseErr(token.loc, `Tried to convert token ${Token.toString(token)} to binary operator.`);
        }
    }

    function tokenToUnOp(token: Token.Token) : Op.Op {
        switch (token.kind) {
            case "Minus": return Op.Neg(token.loc);
            default: throw Err.ParseErr(token.loc, `Tried to convert token ${Token.toString(token)} to unary operator.`);
        }
    }

    function tokenToFnOp(token: Token.Token) : Op.Op {
        switch (token.kind) {
            case "Sin": return Op.Sin(token.loc);
            case "Cos": return Op.Cos(token.loc);
            case "Tan": return Op.Tan(token.loc);
            case "Log": return Op.Log(token.loc);
            case "Sqrt": return Op.Sqrt(token.loc);
            default: throw Err.ParseErr(token.loc, `Tried to convert token ${Token.toString(token)} to fn operator.`);
        }
    }

    function expression() { equality(); }

    function equality() {
        term();
        eat(Token.Equal(0))
        const op = tokenToBinOp(peekPrevious());
        term();
        opcodes.push(op);
    }

    function term() {
        factor();
        while (match([Token.Plus(0), Token.Minus(0)])) {
            const op = tokenToBinOp(peekPrevious());
            factor();
            opcodes.push(op);
        }
    }

    function factor() {
        exponent();
        while (match([Token.Star(0), Token.Slash(0)])) {
            const op = tokenToBinOp(peekPrevious());
            exponent();
            opcodes.push(op);
        }
    }

    function exponent() {
        unary();
        if (match([Token.Hat(0)])) {
            const op = tokenToBinOp(peekPrevious());
            exponent();
            opcodes.push(op);
        }
    }

    function unary() {
        if (match([Token.Minus(0)])) {
            const op = tokenToUnOp(peekPrevious());
            unary();
            opcodes.push(op);
            return;
        }
        fn();
    }

    function fn() {
        if (match([Token.Log(0)])) {
            const op = tokenToFnOp(peekPrevious());
            eat(Token.LParen(0));
            term();
            eat(Token.Comma(0));
            term();
            eat(Token.RParen(0));
            opcodes.push(op);
            return;
        }
        if (match([Token.Sin(0), Token.Cos(0), Token.Tan(0), Token.Sqrt(0)])) {
            const op = tokenToFnOp(peekPrevious());
            unary();
            opcodes.push(op);
            return;
        }
        primary();
    }

    function primary() {
        const token = advance();
        switch (token.kind) {
            case "Num": opcodes.push(Op.Num(token.loc, token.value)); break;
            case "X": opcodes.push(Op.X(token.loc)); break;
            case "Y": opcodes.push(Op.Y(token.loc)); break;
            case "E": opcodes.push(Op.Num(token.loc, Math.E)); break;
            case "Pi": opcodes.push(Op.Num(token.loc, Math.PI)); break;
            case "LParen": term(); eat(Token.RParen(0)); break;
            default: throw Err.ParseErr(token.loc, `Unexpected token '${Token.toString(token)}'`); 
        }
    }

    expression();
    return opcodes;
}

export { parse }