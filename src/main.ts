import { Err } from "./error";
import type { Op } from "./op";
import { parse } from "./parse";
import { initGrids, render } from "./render";
import { tokenize } from "./tokenize";

const inputBox: HTMLInputElement = document.getElementById("input") as HTMLInputElement;
const goButton: HTMLButtonElement = document.getElementById("go-btn") as HTMLButtonElement;
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.strokeStyle = "#FFFFFF";
ctx.lineWidth = 1;

let translation: [number, number] = [0, 0];
let scale = 0.01;
const minScale = 0.0002;
const maxScale = 3;

let isMouseDown = false;

let opcodes: Op.t[] = [];


function run() {
    try {
        const source = inputBox.value;
        const tokens = tokenize(source);
        opcodes = parse(tokens);

        render(opcodes, canvas, ctx, translation, scale);
    } catch (e) {
        const error = e as Err.Err;
        Err.handleError(error);
    }
}

initGrids(canvas);
goButton.addEventListener("click", run);

canvas.addEventListener("mousedown", (_) => { isMouseDown = true; });
canvas.addEventListener("mouseup", (_) => { isMouseDown = false; });
canvas.addEventListener("mouseenter", (_) => { isMouseDown = false; });
canvas.addEventListener("mouseleave", (_) => { isMouseDown = false; });
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        const [dx, dy] = [e.movementX, e.movementY];
        const [tx, ty] = translation;
        translation = [tx - dx*scale, ty + dy*scale];
        render(opcodes, canvas, ctx, translation, scale);
    }
})
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) { 
        scale += 0.0025; 
        scale = Math.min(scale, maxScale);
    }
    else { 
        scale -= 0.0025; 
        scale = Math.max(scale, minScale);
    }
    render(opcodes, canvas, ctx, translation, scale);   
})

