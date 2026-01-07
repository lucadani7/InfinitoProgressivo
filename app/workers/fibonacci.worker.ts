function fiboIterative(n: bigint): bigint {
    let a = 0n, b = 1n;
    for (let i = 0; i < n; ++i) {
        [a, b] = [b, a + b];
    }
    return a;
}

function fiboRecursive(n: bigint): bigint {
    if (n > 40n) {
        throw new Error("N troppo grande per la ricorsione naif!");
    }
    return n == 0n || n == 1n ? n : fiboRecursive(n - 1n) + fiboRecursive(n - 2n);
}

function fiboMemo(n: bigint): bigint {
    const memo = new Map<bigint, bigint>();
    memo.set(0n, 0n);
    memo.set(1n, 1n);
    for (let i = 2n; i <= n; i++) {
        memo.set(i, memo.get(i - 1n)! + memo.get(i - 2n)!);
    }
    return memo.get(n)!;
}

function fiboFastDoubling(n: bigint): bigint {
    return fiboFastDoublingRecursive(n)[0];
}

function fiboFastDoublingRecursive(n: bigint): [bigint, bigint] {
    if (n === 0n) {
        return [0n, 1n];
    }
    const [a, b] = fiboFastDoublingRecursive(n >> 1n);
    const c = a * (2n * b - a);
    const d = a * a + b * b;
    return n % 2n === 0n ? [c, d] : [d, c + d];
}

function power(A: bigint[][], p: bigint): bigint[][] {
    let res: bigint[][] = [[1n, 0n], [0n, 1n]];
    for (; p > 0n; p >>= 1n) {
        if (p % 2n === 1n) {
            res = multiply(res, A);
        }
        A = multiply(A, A);
    }
    return res;
}

function multiply(A: bigint[][], B: bigint[][]): bigint[][] {
    return [
        [
            A[0][0] * B[0][0] + A[0][1] * B[1][0],
            A[0][0] * B[0][1] + A[0][1] * B[1][1]
        ],
        [
            A[1][0] * B[0][0] + A[1][1] * B[1][0],
            A[1][0] * B[0][1] + A[1][1] * B[1][1]
        ]
    ];
}

function fiboMatrix(n: bigint): bigint {
    if (n == 0n || n == 1n) {
        return n;
    }
    const T = [[1n, 1n], [1n, 0n]];
    const result = power(T, n - 1n);
    return result[0][0];
}

self.onmessage = function(e: MessageEvent<{n: number, type: string}>): void {
    const { n, type } = e.data;
    const nBig = BigInt(n);
    const start = performance.now();
    let result: bigint;

    try {
        switch (type) {
            case 'iterative': result = fiboIterative(nBig); break;
            case 'fastDoubling': result = fiboFastDoubling(nBig); break;
            case 'matrix': result = fiboMatrix(nBig); break;
            case 'memo': result = fiboMemo(nBig); break;
            case 'recursive': result = fiboRecursive(nBig); break;
            default: result = -1n;
        }

        self.postMessage({
            type,
            n,
            time: performance.now() - start,
            result: result.toString(),
            success: true
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Errore sconosciuto";

        self.postMessage({
            type,
            n,
            success: false,
            error: errorMessage
        });
    }
}

