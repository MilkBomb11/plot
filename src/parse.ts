import { Err } from "./error";
import { Op } from "./op";
import { Token } from "./token";

function parse(tokens: Token.T[]) : Array<Op.T[]> {
    let current = 0;
    const opcodes: Array<Op.T[]> = [[]];

    function advance() : Token.T { return tokens[current++]; }

    function peek() : Token.T { return tokens[current]; }

    function peekPrevious() : Token.T { return tokens[current-1]; }

    function eat(token: Token.T) {
        if (peek().kind === token.kind) {advance(); return;}
        throw Err.ParseErr(peek().loc, `Expected '${Token.toString(token)}' but got '${Token.toString(peek())}'.`)
    }

    function match(tokens: Token.T[]) : boolean {
        for (const token of tokens) {
            if (peek().kind === token.kind) {
                advance(); return true;
            }
        }
        return false;
    }

    function pushOpcode(opcode: Op.T) { opcodes[opcodes.length-1].push(opcode); }
    
    function tokenToBinOp(token: Token.T) : Op.T {
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

    function tokenToUnOp(token: Token.T) : Op.T {
        switch (token.kind) {
            case "Minus": return Op.Neg(token.loc);
            default: throw Err.ParseErr(token.loc, `Tried to convert token ${Token.toString(token)} to unary operator.`);
        }
    }

    function tokenToFnOp(token: Token.T) : Op.T {
        switch (token.kind) {
            case "Sin": return Op.Sin(token.loc);
            case "Cos": return Op.Cos(token.loc);
            case "Tan": return Op.Tan(token.loc);
            case "Log": return Op.Log(token.loc);
            case "Sqrt": return Op.Sqrt(token.loc);
            default: throw Err.ParseErr(token.loc, `Tried to convert token ${Token.toString(token)} to fn operator.`);
        }
    }

    function sequence() {
        expression();
        while (match([Token.Semicolon(0)])) {
            if (match([Token.Eof(0)])) {return;}
            opcodes.push([]);
            expression();
        }
    }

    function expression() { equality(); }

    function equality() {
        term();
        eat(Token.Equal(0))
        const op = tokenToBinOp(peekPrevious());
        term();
        pushOpcode(op);
    }

    function term() {
        factor();
        while (match([Token.Plus(0), Token.Minus(0)])) {
            const op = tokenToBinOp(peekPrevious());
            factor();
            pushOpcode(op);
        }
    }

    function factor() {
        exponent();
        while (match([Token.Star(0), Token.Slash(0)])) {
            const op = tokenToBinOp(peekPrevious());
            exponent();
            pushOpcode(op);
        }
    }

    function exponent() {
        unary();
        if (match([Token.Hat(0)])) {
            const op = tokenToBinOp(peekPrevious());
            exponent();
            pushOpcode(op);
        }
    }

    function unary() {
        if (match([Token.Minus(0)])) {
            const op = tokenToUnOp(peekPrevious());
            unary();
            pushOpcode(op);
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
            pushOpcode(op);
            return;
        }
        if (match([Token.Sin(0), Token.Cos(0), Token.Tan(0), Token.Sqrt(0)])) {
            const op = tokenToFnOp(peekPrevious());
            unary();
            pushOpcode(op);
            return;
        }
        primary();
    }

    function primary() {
        const token = advance();
        switch (token.kind) {
            case "Num": pushOpcode(Op.Num(token.loc, token.value)); break;
            case "X": pushOpcode(Op.X(token.loc)); break;
            case "Y": pushOpcode(Op.Y(token.loc)); break;
            case "E": pushOpcode(Op.Num(token.loc, Math.E)); break;
            case "Pi": pushOpcode(Op.Num(token.loc, Math.PI)); break;
            case "LParen": term(); eat(Token.RParen(0)); break;
            default: throw Err.ParseErr(token.loc, `Unexpected token '${Token.toString(token)}'`); 
        }
    }

    sequence();
    return opcodes;
}

export { parse }