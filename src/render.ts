import { evaluate } from "./evaluate";
import type { Op } from "./op";

const scalarField: Array<Array<number|undefined>> = [];
const thresholded: Array<Array<number|undefined>> = [];
const indexGrid: Array<Array<number|undefined>> = [];
const factor = 4;

function initGrids(canvas: HTMLCanvasElement) {
    const gridHeight = Math.floor(canvas.height/factor);
    const gridWidth = Math.floor(canvas.width/factor);
    for (let i = 0; i < gridHeight; i++) {
        scalarField.push([]);
        thresholded.push([]);
        for (let j = 0; j < gridWidth; j++) {
            scalarField[i].push(0);
            thresholded[i].push(0);
        }
    }
    for (let i = 0; i < gridHeight-1; i++) {
        indexGrid.push([]);
        for (let j = 0; j < gridWidth-1; j++) {
            indexGrid[i].push(undefined);
        }
    }
}

function render (
    opcodes: Op.Op[], 
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D,
    translation: [number, number], 
    scale: number) {
    function gridSpaceToScreenSpace (p: [number, number]) : [number, number] {
        const [i, j] = p;
        const sy = i * factor;
        const sx = j * factor;
        return [sx, sy];
    }

    function screenSpaceToGridSpace (p: [number, number]) : [number, number] {
        const [x, y] = p;
        const gi = Math.floor(y/factor);
        const gj = Math.floor(x/factor);
        return [gi, gj];
    }
    
    function screenSpaceToWorldSpace (p: [number, number], canvas: HTMLCanvasElement) : [number, number] {
        const [sx, sy] = p;
        const wx = sx - Math.floor(canvas.width/2);
        const wy = Math.floor(canvas.height/2) - sy;
        return [wx, wy];
    }
    
    function applyTransformations (p: [number, number], translation: [number, number], scale: number) {
        const [wx, wy] = p;
        const [tx, ty] = translation;
        const sWx = wx * scale;
        const sWy = wy * scale;
        const tsWx = sWx + tx;
        const tsWy = sWy + ty;
        return [tsWx, tsWy]; 
    }

    function lerp (p1: [number, number], p2: [number, number]) : [number, number] {
        const [x1, y1] = p1;
        const [gi1, gj1] = screenSpaceToGridSpace(p1);

        const [x2, y2] = p2;
        const [gi2, gj2] = screenSpaceToGridSpace(p2);
        const x = x1 + (x2 - x1)*((-scalarField[gi1][gj1]!)/(scalarField[gi2][gj2]!-scalarField[gi1][gj1]!));
        const y = y1 + (y2 - y1)*((-scalarField[gi1][gj1]!)/(scalarField[gi2][gj2]!-scalarField[gi1][gj1]!));
        return [x, y];
    }

    function line (ctx:CanvasRenderingContext2D, p1: [number, number], p2: [number, number]) {
        let [x1, y1] = p1;
        let [x2, y2] = p2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    for (let i = 0; i < scalarField.length; i++) {
        for (let j = 0; j < scalarField[i].length; j++) {
            let [x, y] = applyTransformations(
                screenSpaceToWorldSpace( 
                    gridSpaceToScreenSpace([i, j]),
                     canvas), 
                translation, 
                scale);
            scalarField[i][j] = evaluate(opcodes, x, y);
            if (scalarField[i][j] === undefined) {
                thresholded[i][j] = undefined;
                continue;
            }
            if (scalarField[i][j]! > 0) { thresholded[i][j] = 1; }
            else { thresholded[i][j] = 0; }
        }
    }

    console.log(thresholded, indexGrid);

    for (let i = 0; i < thresholded.length-1; i++) {
        for (let j = 0; j < thresholded[i].length-1; j++) {
            if (thresholded[i][j] === undefined
                || thresholded[i][j+1] === undefined
                || thresholded[i+1][j+1] === undefined
                || thresholded[i+1][j] === undefined
            ) { indexGrid[i][j] = undefined; continue; }

            let index = 0;
            index = index | (thresholded[i][j]! << 3);
            index = index | (thresholded[i][j+1]! << 2);
            index = index | (thresholded[i+1][j+1]! << 1);
            index = index | (thresholded[i+1][j]! << 0);
            indexGrid[i][j] = index;
        }
    }


    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < indexGrid.length; i++) {
        for (let j = 0; j < indexGrid[i].length; j++) {
            const index = indexGrid[i][j];
            if (index === undefined) {continue;}
            const a = gridSpaceToScreenSpace([i, j]);
            const b = gridSpaceToScreenSpace([i, j+1]);
            const c = gridSpaceToScreenSpace([i+1, j+1]);
            const d = gridSpaceToScreenSpace([i+1, j]);
            const abm = lerp(a, b);
            const bcm = lerp(b, c);
            const cdm = lerp(c, d);
            const dam = lerp(d, a);
            switch (index) {
                case 0: break;
                case 1: line(ctx, dam, cdm); break;
                case 2: line(ctx, cdm, bcm); break;
                case 3: line(ctx, dam, bcm); break;
                case 4: line(ctx, bcm, abm); break;
                case 5: line(ctx, dam, abm); line(ctx, cdm, bcm); break;
                case 6: line(ctx, abm, cdm); break;
                case 7: line(ctx, dam, abm); break;
                case 8: line(ctx, dam, abm); break;
                case 9: line(ctx, abm, cdm); break;
                case 10: line(ctx, abm, bcm); line(ctx, cdm, dam); break;
                case 11: line(ctx, abm, bcm); break;
                case 12: line(ctx, dam, bcm); break;
                case 13: line(ctx, bcm, cdm); break;
                case 14: line(ctx, cdm, dam); break;
                case 15: break;
            }
        }
    }
}

export { initGrids, render }