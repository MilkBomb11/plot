namespace Op {
    interface Num {
        kind: "Num",
        loc: number,
        value: number
    }
    export const Num = (loc: number, value: number) =>
        { return {kind:"Num" as const, loc: loc, value: value}; }

    interface X {
        kind: "X",
        loc: number,
    }
    export const X = (loc: number) =>
        { return {kind: "X" as const, loc: loc}; }

    interface Y {
        kind: "Y",
        loc: number,
    }
    export const Y = (loc: number) =>
        { return {kind: "Y" as const, loc: loc}; }

    interface Add {
        kind: "Add",
        loc: number,
    }
    export const Add = (loc: number) =>
        { return {kind: "Add" as const, loc: loc}; }

    interface Sub {
        kind: "Sub",
        loc: number,
    }
    export const Sub = (loc: number) =>
        { return {kind: "Sub" as const, loc: loc}; }

    interface Mul {
        kind: "Mul",
        loc: number,
    }
    export const Mul = (loc: number) =>
        { return {kind: "Mul" as const, loc: loc}; }

    interface Div {
        kind: "Div",
        loc: number,
    }
    export const Div = (loc: number) =>
        { return {kind: "Div" as const, loc: loc}; }

    interface Exp {
        kind: "Exp",
        loc: number,
    }
    export const Exp = (loc: number) =>
        { return {kind: "Exp" as const, loc: loc}; }

    interface Neg {
        kind: "Neg",
        loc: number,
    }
    export const Neg = (loc: number) =>
        { return {kind: "Neg" as const, loc: loc}; }

    interface Log {
        kind: "Log",
        loc: number,
    }
    export const Log = (loc: number) =>
        { return {kind: "Log" as const, loc: loc}; }

    interface Sin {
        kind: "Sin",
        loc: number,
    }
    export const Sin = (loc: number) =>
        { return {kind: "Sin" as const, loc: loc}; }

    interface Cos {
        kind: "Cos",
        loc: number,
    }
    export const Cos = (loc: number) =>
        { return {kind: "Cos" as const, loc: loc}; }

    interface Tan {
        kind: "Tan",
        loc: number,
    }
    export const Tan = (loc: number) =>
        { return {kind: "Tan" as const, loc: loc}; }

    interface Sqrt {
        kind: "Sqrt",
        loc: number,
    }
    export const Sqrt = (loc: number) =>
        { return {kind: "Sqrt" as const, loc: loc}; }

    export type T = Num | X | Y
                    | Add | Sub | Mul | Div | Exp 
                    | Neg | Log | Sin | Cos | Tan | Sqrt 
}

export { Op }
