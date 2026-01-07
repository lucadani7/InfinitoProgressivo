export type FiboMethod = 'iterative' | 'recursive' | 'fastDoubling' | 'matrix' | 'memo';

export interface WorkerInput {
    n: number;
    type: FiboMethod;
}

export interface WorkerOutput {
    type: FiboMethod;
    n: number;
    time: number;
    result: string;
    digits: number;
    success: boolean;
    error?: string;
}