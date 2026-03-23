import { assertUnreachable } from "./helper";

namespace Err {
    interface LexErr extends Error {
        kind: "LexErr"
        loc: number
        msg: string
    }
    export const LexErr = (loc: number, msg: string) =>
        {return {kind:"LexErr" as const, loc: loc, msg: msg};}

    interface ParseErr extends Error {
        kind: "ParseErr"
        loc: number
        msg: string
    }
    export const ParseErr = (loc: number, msg: string) =>
        {return {kind:"ParseErr" as const, loc: loc, msg: msg};}

    export type Err = LexErr | ParseErr;

    export function toString (err: Err) : string {
        switch (err.kind) {
            case "LexErr": return `Lexer -> [at ${err.loc}]: ${err.msg}`;
            case "ParseErr": return `Parser -> [at ${err.loc}]: ${err.msg}`;
            default: assertUnreachable(err);
        }
    }

    export function handleError (err: Err) { console.log(toString(err)); }
}

export { Err }

