#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"

# Run starter-A backtest
echo "==> Running Starter-A backtest"
cd "$ROOT/starter-A"
npm install
npm run build
npm run backtest configs/technical-backtest.yaml

# Run starter-C headless sim (python venv)
echo "==> Running Starter-C simulation (headless)"
cd "$ROOT/starter-C"
python -m venv venv || true
source venv/bin/activate
pip install -r requirements.txt
python sim_env.py --config experiment_config.yaml --headless || true
deactivate

# Collect metrics
echo "==> Collecting metrics"
cd "$ROOT"
python -m venv venv_metrics || true
source venv_metrics/bin/activate
pip install pandas numpy
python tools/collect_metrics.py --backtest starter-A/output/results.csv --robot starter-C/logs/summary.json --out output/metrics.json
deactivate

echo "==> Done. Metrics written to output/metrics.json and output/metrics.md"