import { evaluate } from "./evaluate";
import { Interval } from "./interval";
import type { Op } from "./op";

export function render(
    opcodes: Op.t[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    translation: [number, number],
    scale: number
) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";

    function screenToMath(sx: number, sy: number) : [number, number] {
        const wx = sx - Math.floor(canvas.width / 2);
        const wy = Math.floor(canvas.height / 2) - sy;
        return [(wx * scale) + translation[0], (wy * scale) + translation[1]];
    }

    function mathToScreen(mx: number, my: number) : [number, number] {
        const wx = (mx - translation[0]) / scale;
        const wy = (my - translation[1]) / scale;
        const sx = wx + Math.floor(canvas.width/2);
        const sy = Math.floor(canvas.height/2) - wy;
        return [sx, sy];
    }

    function drawQuad(sx: number, sy: number, size: number) {
        const [mathLeft, mathTop] = screenToMath(sx, sy);
        const [mathRight, mathBottom] = screenToMath(sx + size, sy + size);

        const xInterval = Interval.Interval(mathLeft, mathRight);
        const yInterval = Interval.Interval(mathBottom, mathTop);

        const result = evaluate(opcodes, xInterval, yInterval);

        if (Interval.isNaN(result)) { return; }

        if (result.min <= 0 && result.max >= 0) {
            
            if (size <= 1) {
                if (result.min === -Infinity && result.max === Infinity) { return; }
                ctx.fillRect(sx, sy, 1, 1);
                return;
            }

            const half = size / 2;
            drawQuad(sx, sy, half);               
            drawQuad(sx + half, sy, half);        
            drawQuad(sx, sy + half, half);        
            drawQuad(sx + half, sy + half, half); 
        }
    }

    function drawAxes() {
        ctx.strokeStyle = "#FFFF00";
        let [sx, sy] = mathToScreen(0, 0);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, canvas.height);
        ctx.moveTo(0, sy);
        ctx.lineTo(canvas.width, sy);
        ctx.stroke();
    }

    const initialSize = Math.max(canvas.width, canvas.height);
    const startX = (canvas.width - initialSize) / 2;
    const startY = (canvas.height - initialSize) / 2;

    drawAxes();
    drawQuad(startX, startY, initialSize);
}