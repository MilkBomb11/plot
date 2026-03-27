import { assertUnreachable } from "./helper";

namespace Token {
    interface LParen {
        kind: "LParen";
        loc: number;
    }
    export const LParen = (loc:number) => 
        {return {kind: "LParen" as const, loc: loc}}

    interface RParen {
        kind: "RParen";
        loc: number;
    }
    export const RParen = (loc:number) => 
        {return {kind: "RParen" as const, loc: loc}}

    interface Plus {
        kind: "Plus";
        loc: number;
    }
    export const Plus = (loc:number) => 
        {return {kind: "Plus" as const, loc: loc}}

    interface Minus {
        kind: "Minus";
        loc: number;
    }
    export const Minus = (loc:number) => 
        {return {kind: "Minus" as const, loc: loc}}

    interface Star {
        kind: "Star";
        loc: number;
    }
    export const Star = (loc:number) => 
        {return {kind: "Star" as const, loc: loc}}

    interface Slash {
        kind: "Slash";
        loc: number;
    }
    export const Slash = (loc:number) => 
        {return {kind: "Slash" as const, loc: loc}}

    interface Hat {
        kind: "Hat";
        loc: number;
    }
    export const Hat = (loc:number) => 
        {return {kind: "Hat" as const, loc: loc}}

    interface Comma {
        kind: "Comma";
        loc: number;
    }
    export const Comma = (loc:number) => 
        {return {kind: "Comma" as const, loc: loc}}

    interface Equal {
        kind: "Equal";
        loc: number;
    }
    export const Equal = (loc:number) => 
        {return {kind: "Equal" as const, loc: loc}}

    interface Semicolon {
        kind: "Semicolon";
        loc: number;
    }
    export const Semicolon = (loc:number) => 
        {return {kind: "Semicolon" as const, loc: loc}}

    interface Eof {
        kind: "Eof";
        loc: number;
    }
    export const Eof = (loc:number) => 
        {return {kind: "Eof" as const, loc: loc}}

    interface Log {
        kind: "Log";
        loc: number;
    }
    export const Log = (loc:number) => 
        {return {kind: "Log" as const, loc: loc}}

    interface Sin {
        kind: "Sin";
        loc: number;
    }
    export const Sin = (loc:number) => 
        {return {kind: "Sin" as const, loc: loc}}

    interface Cos {
        kind: "Cos";
        loc: number;
    }
    export const Cos = (loc:number) => 
        {return {kind: "Cos" as const, loc: loc}}

    interface Tan {
        kind: "Tan";
        loc: number;
    }
    export const Tan = (loc:number) => 
        {return {kind: "Tan" as const, loc: loc}}

    interface Sqrt {
        kind: "Sqrt";
        loc: number;
    }
    export const Sqrt = (loc:number) => 
        {return {kind: "Sqrt" as const, loc: loc}}

    interface X {
        kind: "X";
        loc: number;
    }
    export const X = (loc:number) => 
        {return {kind: "X" as const, loc: loc}}

    interface Y {
        kind: "Y";
        loc: number;
    }
    export const Y = (loc:number) => 
        {return {kind: "Y" as const, loc: loc}}

    interface Pi {
        kind: "Pi";
        loc: number;
    }
    export const Pi = (loc:number) => 
        {return {kind: "Pi" as const, loc: loc}}

    interface E {
        kind: "E";
        loc: number;
    }
    export const E = (loc:number) => 
        {return {kind: "E" as const, loc: loc}}

    interface Num {
        kind: "Num";
        loc: number;
        value: number;
    }
    export const Num = (loc:number, value:number) => 
        {return {kind: "Num" as const, value: value, loc: loc}}

    export type T = LParen | RParen 
                        | Plus | Minus | Star | Slash | Hat 
                        | Comma | Equal | Semicolon | Eof 
                        | Log | Sin | Cos | Tan | Sqrt
                        | X | Y | Pi | E | Num

    export function toString (token:T) {
        switch (token.kind) {
            case "Num": return `${token.value}`;
            case "X": return 'x';
            case "Y": return 'y';
            case "E": return 'e';
            case "Pi": return "pi";
            case "Equal": return '=';
            case "Plus": return '+';
            case "Minus": return '-';
            case "Star": return '*';
            case "Slash": return '/';
            case "Hat": return '^';
            case "LParen": return '(';
            case "RParen": return ')';
            case "Comma": return ',';
            case "Semicolon": return ';';
            case "Log": return "log";
            case "Sin": return "sin";
            case "Cos": return "cos";
            case "Tan": return "tan";
            case "Sqrt": return "sqrt";
            case "Eof": return "eof";
            default: assertUnreachable(token);
        }
    }
}

export { Token }

