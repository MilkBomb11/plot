import { assertUnreachable } from "./helper";
import { Interval } from "./interval";
import type { Op } from "./op";

function evaluate(opcodes: Op.t[], x: Interval.t, y: Interval.t) : Interval.t {
    const stack: Interval.t[] = []; 
    for (const opcode of opcodes) {
        switch (opcode.kind) {
            case "Num": stack.push(Interval.Interval(opcode.value, opcode.value)); break;
            case "X": stack.push(x); break;
            case "Y": stack.push(y); break;
            case "Neg": stack.push(Interval.neg(stack.pop()!)); break;
            case "Sin": stack.push(Interval.sin(stack.pop()!)); break;
            case "Cos": stack.push(Interval.cos(stack.pop()!)); break;
            case "Tan": stack.push(Interval.tan(stack.pop()!)); break;
            case "Sqrt": stack.push(Interval.sqrt(stack.pop()!)); break;
            case "Add": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(Interval.add(left, right));
                break;
            }
            case "Sub": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(Interval.sub(left, right));
                break;
            }
            case "Mul": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(Interval.mul(left, right));
                break;
            }
            case "Div": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(Interval.div(left, right));
                break;
            }
            case "Exp": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(Interval.pow(left, right));
                break;
            }
            case "Log": {
                const antiLog = stack.pop()!;
                const base = stack.pop()!;
                stack.push(Interval.log(base, antiLog));
                break;
            }
            default: assertUnreachable(opcode);
        }
    }
    return stack[stack.length-1];
}

export { evaluate }
