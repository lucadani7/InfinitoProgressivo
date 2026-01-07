# 🌀 Infinito Progressivo Progetto

Analisi computazionale e benchmark della successione di Fibonacci.

Un laboratorio digitale che confronta l'efficienza di diversi approcci algoritmici - da $O(2^n)$ a $O(\log n)$ - ottimizzato per gestire numeri di dimensioni arbitrarie tramite calcolo parallelo.

---

## 🚀 Caratteristiche Tecniche
* **Web Workers**: Calcolo multi-threaded per mantenere l'interfaccia reattiva.
* **BigInt Native**: Precisione assoluta per risultati con milioni di cifre.
* **Grafici in Real-time**: Visualizzazione immediata delle prestazioni (ms).
* **Persistenza**: Salvataggio automatico della sessione nel browser.
* **Export**: Esportazione dei risultati in formato `.txt`.

---

## 🧠 Algoritmi Implementati
* **Matriciale / Fast Doubling**: $O(\log n)$ — Massima efficienza logaritmica.
* **Iterativo / Memoizazzione**: $O(n)$ — Approccio lineare standard.
* **Ricorsivo Naive**: $O(2^n)$ — Inserito per scopi didattici.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 15 (App Router)
* **Linguaggio**: TypeScript
* **Grafica**: Tailwind CSS & Recharts

---

## 📦 Installazione
1. Clona il repository:
   ```bash
     git clone https://github.com/lucadani7/InfinitoProgressivo
     cd InfinitoProgressivo
   ```
2. Installa le dipendenze:
    ```bash
      npm install
    ```
3. Avvia in modalità sviluppo:
    ```bash
      npm run dev
    ```
4. Apri il tuo browser preferito all'indirizzo `http://localhost:3000`.

---

## 📜 Citazione
> "Sed quoniam numerus numerus additur, et numerus ex additione procedit" — Leonardo Fibonacci, Liber Abaci (1202).

> "E poiché un numero viene aggiunto a un numero, un nuovo numero procede dall'addizione." — Leonardo Fibonacci, Liber Abaci (1202).

---

## 📄 Licenza

Questo progetto è rilasciato sotto la licenza Apache-2.0.
