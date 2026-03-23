function assertUnreachable (_x: never): never { throw new Error("Non exhaustive match"); }

export { assertUnreachable }