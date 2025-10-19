#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "==> Repo root: $ROOT"

# Check expected outputs
echo "Checking Starter-A results..."
if [ -f "$ROOT/starter-A/output/results.csv" ]; then
  echo "✔ starter-A/output/results.csv found"
else
  echo "✖ missing starter-A/output/results.csv" >&2; exit 2
fi

echo "Checking Starter-C summary..."
if [ -f "$ROOT/starter-C/logs/summary.json" ]; then
  echo "✔ starter-C/logs/summary.json found"
else
  echo "✖ missing starter-C/logs/summary.json" >&2; exit 2
fi

echo "Checking collected metrics..."
if [ -f "$ROOT/output/metrics.json" ]; then
  echo "✔ output/metrics.json found"
else
  echo "✖ missing output/metrics.json" >&2; exit 2
fi

echo
echo "==> Tail results (top 10 rows):"
head -n 12 "$ROOT/starter-A/output/results.csv" || true

echo
echo "==> Show robot summary (starter-C/logs/summary.json):"
jq -S . "$ROOT/starter-C/logs/summary.json" || cat "$ROOT/starter-C/logs/summary.json" || true

echo
echo "==> Show collected metrics (output/metrics.json):"
jq -S . "$ROOT/output/metrics.json" || cat "$ROOT/output/metrics.json" || true

echo
echo "==> Quick Python KPI check (requires pandas,numpy):"
python - <<'PY'
import json, os
mfile='output/metrics.json'
if os.path.exists(mfile):
    m=json.load(open(mfile))
    print("Collected at:", m.get("collected_at"))
    print("Backtest KPIs:", m.get("backtest"))
    print("Robot KPIs:", m.get("robot"))
else:
    print("No metrics.json found")
PY

echo "==> validate.sh finished successfully."