#!/usr/bin/env python3
"""
Collect KPIs from starter-A results and starter-C logs, produce metrics.json and summary.md
Usage:
  python tools/collect_metrics.py --backtest starter-A/output/results.csv --robot starter-C/logs/summary.json --out output/metrics.json
"""
import argparse, json, math, os, pandas as pd, numpy as np
from datetime import datetime

def sharpe(returns, freq=252):
    if len(returns) < 2:
        return None
    mu = np.mean(returns)
    sigma = np.std(returns, ddof=1)
    if sigma == 0: return None
    return (mu / sigma) * math.sqrt(freq)

def max_drawdown(cum_returns):
    peak = cum_returns.cummax()
    dd = (cum_returns - peak) / peak
    return float(dd.min()) if not dd.empty else None

def compute_trading_kpis(df):
    # expects df has 'pnl' (per-trade profit/loss) and optionally 'timestamp'
    metrics = {}
    if df is None or df.shape[0] == 0:
        return metrics
    pnl = df['pnl'].astype(float)
    metrics['num_trades'] = int(len(pnl))
    metrics['total_pnl'] = float(pnl.sum())
    metrics['win_rate'] = float((pnl > 0).mean())
    # assume trades spaced daily for sharpe estimation if no timestamp: use sample freq daily
    per_trade_returns = pnl
    metrics['sharpe_est'] = None
    try:
        metrics['sharpe_est'] = sharpe(per_trade_returns.values, freq=252)
    except Exception:
        metrics['sharpe_est'] = None
    # approximate cumulative P&L series for drawdown
    cum = pnl.cumsum()
    metrics['max_drawdown'] = max_drawdown(cum)
    # basic CAGR approximation (if timestamp present)
    if 'timestamp' in df.columns:
        try:
            t0 = pd.to_datetime(df['timestamp'].iloc[0])
            t1 = pd.to_datetime(df['timestamp'].iloc[-1])
            years = max((t1 - t0).days / 365.25, 1e-9)
            metrics['cagr_approx'] = ((1 + float(pnl.sum())) ** (1/years) - 1) if (pnl.sum() > -0.999) else None
        except Exception:
            metrics['cagr_approx'] = None
    return metrics

def compute_robot_kpis(robot_json):
    if not robot_json:
        return {}
    metrics = {}
    # look for keys common in PoC: success_rate, collisions, episodes, path_efficiency
    metrics['robot_success_rate'] = robot_json.get('success_rate')
    metrics['robot_collision_rate'] = robot_json.get('collision_rate')
    metrics['robot_path_efficiency'] = robot_json.get('path_efficiency')
    return metrics

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--backtest', required=False, help='path to starter-A results.csv')
    p.add_argument('--robot', required=False, help='path to starter-C summary.json')
    p.add_argument('--out', required=False, default='output/metrics.json', help='output metrics JSON')
    args = p.parse_args()

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    result = {
        'collected_at': datetime.utcnow().isoformat() + 'Z',
        'backtest': {},
        'robot': {}
    }

    # Backtest
    if args.backtest and os.path.exists(args.backtest):
        try:
            df = pd.read_csv(args.backtest)
            result['backtest'] = compute_trading_kpis(df)
        except Exception as e:
            result['backtest_error'] = str(e)
    else:
        result['backtest_error'] = f'file not found: {args.backtest}'

    # Robot
    if args.robot and os.path.exists(args.robot):
        try:
            with open(args.robot, 'r') as f:
                robot_json = json.load(f)
            result['robot'] = compute_robot_kpis(robot_json)
        except Exception as e:
            result['robot_error'] = str(e)
    else:
        result['robot_error'] = f'file not found: {args.robot}'

    # write metrics.json
    with open(args.out, 'w') as f:
        json.dump(result, f, indent=2)
    # also create human summary
    summary_path = os.path.splitext(args.out)[0] + '.md'
    with open(summary_path, 'w') as f:
        f.write(f"# Metrics summary\nCollected at: {result['collected_at']}\n\n")
        f.write("## Backtest KPIs\n\n")
        if result.get('backtest'):
            for k,v in result['backtest'].items():
                f.write(f"- **{k}**: {v}\n")
        else:
            f.write(f"- Error: {result.get('backtest_error')}\n")
        f.write("\n## Robot KPIs\n\n")
        if result.get('robot'):
            for k,v in result['robot'].items():
                f.write(f"- **{k}**: {v}\n")
        else:
            f.write(f"- Error: {result.get('robot_error')}\n")
    print(f"Wrote metrics to {args.out} and {summary_path}")

if __name__ == '__main__':
    main()