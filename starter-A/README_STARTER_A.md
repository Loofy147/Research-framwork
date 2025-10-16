# Starter A: EMA+RSI Backtest

This starter project provides a simple but complete backtesting engine for a trading strategy based on EMA and RSI indicators.

## How to Run

1.  **Install dependencies:**
    ```bash
    npm ci
    ```

2.  **Build the TypeScript source:**
    ```bash
    npm run build
    ```

3.  **Run the backtest:**
    ```bash
    npm run backtest -- --config configs/technical-backtest.yaml
    ```

## What it Does

-   **Generates Synthetic Data:** Creates a series of random hourly candle data for the backtest.
-   **Runs the Agent:** The `EmaRsiAgent` processes the candle data and generates `buy`, `sell`, or `hold` signals based on its strategy.
-   **Outputs Results:**
    -   `output/results.csv`: A CSV file containing each candle and the corresponding signal.
    -   `output/summary.md`: A Markdown file with key performance metrics like total trades and win rate.

## Configuration

The backtest is configured via `configs/technical-backtest.yaml`. You can adjust agent parameters (like EMA and RSI periods) and simulation settings (like the number of days to backtest).