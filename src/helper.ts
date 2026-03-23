function assertUnreachable (_x: never): never { throw new Error("Non exhaustive match"); }

function getBit (n: number, pos: number) {
    return (n >> pos) & 1;
}

function setBit (n: number, pos: number, value: boolean) {
    if (value) { return n | (1 << pos); }
    else { return n & ~(1 << pos); }
}

export { assertUnreachable, getBit, setBit }