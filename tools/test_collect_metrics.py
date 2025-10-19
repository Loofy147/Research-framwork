import unittest
import os
import json
import pandas as pd
from tools.collect_metrics import compute_trading_kpis, compute_robot_kpis

class TestCollectMetrics(unittest.TestCase):

    def test_compute_trading_kpis(self):
        data = {'pnl': [10, -5, 20, -10]}
        df = pd.DataFrame(data)
        kpis = compute_trading_kpis(df)
        self.assertEqual(kpis['num_trades'], 4)
        self.assertEqual(kpis['total_pnl'], 15)
        self.assertEqual(kpis['win_rate'], 0.5)
        self.assertAlmostEqual(kpis['sharpe_est'], 4.323, places=3)

    def test_compute_trading_kpis_zero_std(self):
        data = {'pnl': [10, 10, 10, 10]}
        df = pd.DataFrame(data)
        kpis = compute_trading_kpis(df)
        self.assertEqual(kpis['num_trades'], 4)
        self.assertEqual(kpis['total_pnl'], 40)
        self.assertEqual(kpis['win_rate'], 1.0)
        self.assertIsNone(kpis['sharpe_est'])

    def test_compute_robot_kpis(self):
        data = {'success_rate': 0.9, 'collision_rate': 0.1, 'path_efficiency': 0.8}
        kpis = compute_robot_kpis(data)
        self.assertEqual(kpis['robot_success_rate'], 0.9)
        self.assertEqual(kpis['robot_collision_rate'], 0.1)
        self.assertEqual(kpis['robot_path_efficiency'], 0.8)

if __name__ == '__main__':
    unittest.main()