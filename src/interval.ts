namespace Interval {
    interface Interval {
        min: number;
        max: number;
    }
    export type t = Interval;

    export const Interval = (min: number, max: number) => 
        { return {min: min, max: max}; }

    export function isNaN(interval: t) : boolean { 
        return Number.isNaN(interval.min) 
            || Number.isNaN(interval.max); 
    }

    export function add (a: t, b: t) : t { 
        if (isNaN(a) || isNaN(b)) return Interval(NaN, NaN);
        const min = a.min + b.min;
        const max = a.max + b.max;
        return Interval(
            Number.isNaN(min) ? -Infinity : min,
            Number.isNaN(max) ? Infinity : max
        )
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

    export function neg(a: t) : t {
        if (isNaN(a)) { return Interval(NaN, NaN); }
        return Interval(-a.max, -a.min);
    }

    export function sqrt(a: t) : t {
        if (isNaN(a) || a.max < 0) { return Interval(NaN, NaN); }
        const min = a.min < 0 ? 0 : Math.sqrt(a.min);
        return Interval(min, Math.sqrt(a.max));
    }

    function ln(a: t) : t {
        if (isNaN(a) || a.max <= 0) { return Interval(NaN, NaN); }
        const min = a.min <= 0 ? -Infinity : Math.log(a.min);
        return Interval(min, Math.log(a.max));
    }

    export function log(base: t, antilog: t) : t {
        return div(ln(antilog), ln(base));
    }

    export function pow(base: t, exp: t) : t {
        if (isNaN(base) || isNaN(exp)) return Interval(NaN, NaN);

        if (exp.min === exp.max && Number.isInteger(exp.min)) {
            const n = exp.min;
            if (n === 0) { return Interval(1, 1); }

            if (n < 0) {
                const positivePow = pow(base, Interval(-n, -n));
                return div(Interval(1, 1), positivePow);
            }
            
            if (n % 2 !== 0) {
                return Interval(Math.pow(base.min, n), Math.pow(base.max, n));
            } 
            
            if (n % 2 === 0) {
                if (base.min < 0 && base.max > 0) {
                    const maxBound = Math.max(Math.pow(base.min, n), Math.pow(base.max, n));
                    return Interval(0, maxBound);
                }

                const p1 = Math.pow(base.min, n);
                const p2 = Math.pow(base.max, n);
                return Interval(Math.min(p1, p2), Math.max(p1, p2));
            }
        }

        if (base.max <= 0) { return Interval(NaN, NaN); }

        const lnBase = ln(base);
        const bTimesLnA = mul(exp, lnBase);
        return Interval(Math.exp(bTimesLnA.min), Math.exp(bTimesLnA.max));
    }

    export function sin(a: t) : t {
        if (isNaN(a)) return Interval(NaN, NaN);

        if (a.max - a.min >= 2*Math.PI) { return Interval(-1, 1); }

        let min = Math.sin(a.min);
        let max = Math.sin(a.max);
        if (min > max) { let temp = min; min = max; max = temp; }

        const TAU = 2 * Math.PI;
        
        const maxPeak = Math.floor((a.max - Math.PI/2) / TAU);
        const minPeak = Math.floor((a.min - Math.PI/2) / TAU);
        if (maxPeak > minPeak) max = 1;

        const maxValley = Math.floor((a.max - 3*Math.PI/2) / TAU);
        const minValley = Math.floor((a.min - 3*Math.PI/2) / TAU);
        if (maxValley > minValley) min = -1;

        return Interval(min, max);
    }

    export function cos(a: t) : t {
        if (isNaN(a)) return Interval(NaN, NaN);
        return sin(Interval(a.min + Math.PI / 2, a.max + Math.PI / 2));
    }

    export function tan(a: t) : t {
        if (isNaN(a)) return Interval(NaN, NaN);

        if (a.max - a.min >= Math.PI) { return Interval(-Infinity, Infinity); }

        const maxAsymptote = Math.floor((a.max - Math.PI / 2) / Math.PI);
        const minAsymptote = Math.floor((a.min - Math.PI / 2) / Math.PI);

        if (maxAsymptote > minAsymptote) { return Interval(-Infinity, Infinity); }

        return Interval(Math.tan(a.min), Math.tan(a.max));
    }
}

export { Interval }

