import { assertUnreachable } from "./helper";
import type { Op } from "./op";

function evaluate(opcodes: Op.t[], x: number, y: number) : number | undefined {
    const stack: number[] = []; 
    for (const opcode of opcodes) {
        switch (opcode.kind) {
            case "Num": stack.push(opcode.value); break;
            case "X": stack.push(x); break;
            case "Y": stack.push(y); break;
            case "Neg": stack.push(-stack.pop()!); break;
            case "Sin": stack.push(Math.sin(stack.pop()!)); break;
            case "Cos": stack.push(Math.cos(stack.pop()!)); break;
            case "Tan": stack.push(Math.tan(stack.pop()!)); break;
            case "Sqrt": {
                const operand = stack.pop()!;
                if (operand < 0) { return undefined; }
                stack.push(Math.sqrt(operand)); 
                break;
            }
            case "Add": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(left + right);
                break;
            }
            case "Sub": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(left - right);
                break;
            }
            case "Mul": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(left * right);
                break;
            }
            case "Div": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                if (right === 0) { return undefined; }
                stack.push(left / right);
                break;
            }
            case "Exp": {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(left ** right);
                break;
            }
            case "Log": {
                const antiLog = stack.pop()!;
                const base = stack.pop()!;
                if (antiLog <= 0) { return undefined; }
                if (base <= 0 || base === 1) { return undefined; }
                stack.push(Math.log(antiLog)/Math.log(base))
                break;
            }
            default: assertUnreachable(opcode);
        }
    }
    return stack[stack.length-1];
}

export { evaluate }
