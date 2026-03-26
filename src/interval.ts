namespace Interval {
    interface Interval {
        min: number;
        max: number;
    }
    export type t = Interval;

    export const Interval = (min: number, max: number) => 
        { return {min: min, max: max}; }

    function isNaN(interval: t) : boolean { 
        return Number.isNaN(interval.min) 
            || Number.isNaN(interval.max); 
    }

    export function add (a: t, b: t) : t { 
        if (isNaN(a) || isNaN(b)) return Interval(NaN, NaN);
        return Interval(a.min + b.min, a.max + b.max); 
    }

    export function sub (a: t, b: t) : t {
        if (isNaN(a) || isNaN(b)) return Interval(NaN, NaN);
        const min = a.min - b.max;
        const max = a.max - b.min;
        return Interval(
            Number.isNaN(min) ? -Infinity : min,
            Number.isNaN(max) ? Infinity : max
        )
    }

    export function mul (a: t, b: t) : t {
        if (isNaN(a) || isNaN(b)) return Interval(NaN, NaN);
        if ((a.min === 0 && a.max === 0) || (b.min === 0 && b.max === 0)) {
            return Interval(0, 0);
        }
        const p1 = a.min * b.min;
        const p2 = a.min * b.max;
        const p3 = a.max * b.min;
        const p4 = a.max * b.max;

        const min = Math.min(p1, p2, p3, p4);
        const max = Math.max(p1, p2, p3, p4);
        return Interval(
            Number.isNaN(min) ? -Infinity : min,
            Number.isNaN(max) ? Infinity : max
        );
    }

    export function div (a: t, b: t) : t {
        if (isNaN(a) || isNaN(b)) return Interval(NaN, NaN);
        if (b.min === 0 && b.max === 0) { return Interval(NaN, NaN); }
        if (b.min < 0 && b.max > 0) {
            if (a.min === 0 && a.max === 0) return Interval(0, 0);
            return Interval(-Infinity, Infinity);
        }
        if (b.min === 0) { return mul(a, Interval(1 / b.max, Infinity)); }
        if (b.max === 0) { return mul(a, Interval(-Infinity, 1 / b.min)); }
        const oneOverB = Interval(1 / b.max, 1 / b.min);
        return mul(a, oneOverB);
    }
}

export { Interval }

