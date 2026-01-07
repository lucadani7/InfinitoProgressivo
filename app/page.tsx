'use client';

import React, {useEffect, useRef, useState} from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

// 1. Definiamo l'interfaccia del risultato
interface FibonacciResult {
    type: string;
    n: number;
    time: number;
    result: string;
    success: boolean;
    error?: string;
    timestamp: number;
}

// 2. Tipo per risolvere il conflitto MessageEvent
export default function InfinitoProgressivo() {
    const [n, setN] = useState<number>(1000);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    // Inizializzatore Lazy (Previene render a cascata)
    const [results, setResults] = useState<FibonacciResult[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('infinito_progressivo_data');
            try {
                return saved ? (JSON.parse(saved) as FibonacciResult[]) : [];
            } catch (e) {
                console.error("Errore storage:", e);
                return [];
            }
        }
        return [];
    });

    // Effetto dedicato per il salvataggio (Best Practice per ESLint)
    useEffect(() => {
        if (typeof window !== 'undefined' && results.length > 0) {
            localStorage.setItem('infinito_progressivo_data', JSON.stringify(results));
        }
    }, [results]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);

        // Carichiamo i dati qui, DOPO che il componente è montato sul client
        const saved = localStorage.getItem('infinito_progressivo_data');
        if (saved) {
            try {
                setResults(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }

        const worker = new Worker(new URL('./workers/fibonacci.worker.ts', import.meta.url));
        workerRef.current = worker;

        const handleMessage = (e: Event) => {
            // Cast dell'evento per recuperare i dati tipizzati
            const workerEvent = e as MessageEvent;
            const data = workerEvent.data;

            if (data.success) {
                const dataWithTime = {...data, timestamp: Date.now()};

                // Usiamo l'aggiornamento funzionale: prev => ...
                // Questo garantisce che React gestisca l'aggiornamento in modo ottimale
                setResults((prev) => {
                    return [dataWithTime, ...prev].slice(0, 50);
                });
            }
            setIsCalculating(false);
        };

        worker.addEventListener('message', handleMessage as EventListener);

        return () => {
            worker.removeEventListener('message', handleMessage as EventListener);
            worker.terminate();
        };
    }, []); // Array di dipendenze vuoto: gira solo al mount

    const runCalc = (type: string) => {
        if (!workerRef.current) return; // Controllo di sicurezza per il ref

        setIsCalculating(true);

        // Creiamo l'oggetto rispettando l'interfaccia
        const message: { n: number; type: string } = {n, type};

        // Inviamo il messaggio usando il cast 'as any' solo se il compilatore
        // continua a dare errore sulla firma del metodo postMessage
        workerRef.current.postMessage(message);
    };

    const clearHistory = () => {
        if (window.confirm("Cancellare tutta la cronologia?")) {
            setResults([]);
            localStorage.removeItem('infinito_progressivo_data');
        }
    };

    const downloadResult = (res: FibonacciResult) => {
        const blob = new Blob([
            `INFINITO PROGRESSIVO\nF(${res.n}) via ${res.type}\nTempo: ${res.time}ms\n\nRisultato:\n${res.result}`
        ], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fibonacci_${res.n}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const chartData = results
        .filter(r => r.success)
        .slice(0, 10)
        .reverse()
        .map(r => ({
            label: `n=${r.n}`,
            [r.type]: parseFloat(r.time.toFixed(4))
        }));

    return (
        <div className="min-h-screen bg-[#f4f1ea] text-[#2c3e50] font-serif p-4 md:p-10">
            <header className="max-w-6xl mx-auto text-center border-b-4 border-[#1a4d2e] pb-6 mb-12">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1a4d2e]">
                    INFINITO PROGRESSIVO
                </h1>
                <p className="mt-3 text-lg md:text-2xl italic opacity-80 uppercase tracking-widest text-stone-600">
                    Laboratorio di Leonardo Fibonacci
                </p>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <section className="bg-white p-8 shadow-2xl border-t-8 border-[#1a4d2e]">
                    <h2 className="text-2xl font-bold mb-6 border-b border-stone-100 pb-2 italic text-stone-800">Configurazione</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2 tracking-widest text-stone-500">
                                Valore di n
                            </label>
                            <input
                                type="number"
                                value={n}
                                onChange={(e) => setN(Number(e.target.value))}
                                className="w-full bg-stone-50 border-2 border-[#1a4d2e] p-4 text-2xl font-mono outline-none focus:bg-white transition-all text-stone-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <button onClick={() => runCalc('iterative')} disabled={isCalculating}
                                    className="bg-[#1a4d2e] text-white py-3 font-bold hover:bg-[#143d24] disabled:opacity-50 transition-colors">ITERATIVO
                            </button>
                            <button onClick={() => runCalc('matrix')} disabled={isCalculating}
                                    className="bg-[#2c3e50] text-white py-3 font-bold hover:bg-[#1c2833] disabled:opacity-50 transition-colors">MATRICE
                            </button>
                            <button onClick={() => runCalc('fastDoubling')} disabled={isCalculating}
                                    className="bg-[#b8860b] text-white py-3 font-bold hover:bg-[#9a7109] disabled:opacity-50 transition-colors">FAST
                                DOUBLING
                            </button>
                            <button onClick={() => runCalc('memo')} disabled={isCalculating}
                                    className="bg-stone-400 text-white py-2 font-bold hover:bg-stone-500">MEMOIZZAZIONE
                            </button>
                            <button onClick={() => runCalc('recursive')} disabled={isCalculating}
                                    className="border-2 border-red-800 text-red-800 py-2 font-bold hover:bg-red-50">RICORSIVO
                            </button>
                        </div>

                        <button onClick={clearHistory}
                                className="w-full text-[10px] uppercase tracking-widest text-stone-400 hover:text-red-600 mt-4 font-bold transition-colors">
                            🗑 Svuota Cronologia
                        </button>
                    </div>
                </section>

                <section className="lg:col-span-2 space-y-10">
                    <div className="bg-white p-6 shadow-xl h-[400px] flex flex-col border-t-4 border-stone-200">
                        <h3 className="text-sm font-black uppercase mb-4 text-[#1a4d2e] tracking-widest">Analisi
                            Prestazioni Recenti (ms)</h3>
                        <div className="flex-1 w-full min-h-0">
                            {isMounted && chartData.length > 0 ? (
                                <ResponsiveContainer width="99%" height="100%">
                                    <LineChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                                        <XAxis dataKey="label" stroke="#999" fontSize={10} tick={{dy: 10}}/>
                                        <YAxis stroke="#999" fontSize={10} tick={{dx: -5}}/>
                                        <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #1a4d2e'}}/>
                                        <Legend iconType="circle" wrapperStyle={{paddingTop: "20px"}}/>
                                        <Line type="monotone" dataKey="iterative" stroke="#1a4d2e" strokeWidth={3}
                                              isAnimationActive={false}/>
                                        <Line type="monotone" dataKey="matrix" stroke="#2c3e50" strokeWidth={3}
                                              isAnimationActive={false}/>
                                        <Line type="monotone" dataKey="fastDoubling" stroke="#b8860b" strokeWidth={3}
                                              isAnimationActive={false}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div
                                    className="flex items-center justify-center h-full text-stone-300 italic text-sm border-2 border-dashed border-stone-100">
                                    {isCalculating ? "Elaborazione in corso..." : "Esegui un calcolo per visualizzare i grafici statistici."}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 shadow-xl border-t-4 border-stone-200">
                        <h3 className="text-sm font-black uppercase mb-6 text-[#1a4d2e] tracking-widest border-b pb-2 italic">Registro
                            Calcoli</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {results.length === 0 &&
                                <p className="text-stone-400 italic text-center py-10">Nessun benchmark registrato nella
                                    sessione attuale.</p>}
                            {results.map((res) => (
                                <div key={res.timestamp}
                                     className="group border-l-4 border-[#1a4d2e] bg-stone-50 p-4 flex justify-between items-center shadow-sm hover:bg-stone-100 transition-colors">
                                    <div>
                                        <span
                                            className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">{new Date(res.timestamp).toLocaleTimeString()}</span>
                                        <p className="font-bold text-lg text-stone-800">F({res.n}) <span
                                            className="text-xs font-normal text-stone-500 underline ml-2">{res.type}</span>
                                        </p>
                                        <p className={`text-xs ${res.success ? 'text-green-700' : 'text-red-600'}`}>
                                            {res.success ? `${res.time.toFixed(4)} ms | ${res.result.length} cifre` : `Errore: ${res.error}`}
                                        </p>
                                    </div>
                                    {res.success && (
                                        <button onClick={() => downloadResult(res)}
                                                className="opacity-0 group-hover:opacity-100 bg-[#1a4d2e] text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest transition-opacity hover:bg-[#143d24]">
                                            Esporta .txt
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mt-[50px] py-[40px] border-t border-stone-200 text-center text-stone-500 text-sm">
                <div className="mb-2 italic text-stone-400 tracking-wide font-serif text-base">
                    &#34;Sed quoniam numerus numerus additur, et numerus ex additione procedit.&#34;
                </div>
                <div className="mb-2 italic text-stone-400 tracking-wide font-serif text-base">
                    &#34;E poiché un numero viene aggiunto a un numero, un nuovo numero procede dall&#39;addizione.&#34;
                </div>
                <div className="mb-2 font-serif">Progettato e Sviluppato da <strong>Luca Daniel Ionescu</strong></div>
                <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <a href="https://github.com/lucadani7/InfinitoProgressivo" target="_blank"
                       className="text-[#1a4d2e] hover:underline transition-all">Codice Sorgente</a>
                    <span className="text-stone-300">|</span>
                    <a href="https://github.com/lucadani7" target="_blank"
                       className="text-[#1a4d2e] hover:underline transition-all">Profilo GitHub</a>
                </div>
                <div className="mt-6 text-[10px] text-stone-400 uppercase tracking-[0.3em] font-black">
                    © {isMounted ? new Date().getFullYear() : "2026"} Infinito Progressivo Progetto
                </div>
            </footer>
        </div>
    );
}