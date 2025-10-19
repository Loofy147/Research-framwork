import pybullet as p
import pybullet_data
import time
import numpy as np
import yaml
import argparse
import os
import json

from agent_pid import AgentPID

class SimEnv:
    def __init__(self, config, headless=False):
        self.config = config
        self.headless = headless
        p.connect(p.DIRECT if self.headless else p.GUI)
        p.setAdditionalSearchPath(pybullet_data.getDataPath())
        p.setGravity(0, 0, -9.81)

        self.plane_id = p.loadURDF("plane.urdf")
        self.robot_id = p.loadURDF("r2d2.urdf", config['start_pos'])

        self.agent = AgentPID(config['pid'])
        self.target_pos = np.array(config['target_pos'])

    def run_simulation(self):
        start_time = time.time()
        collisions = 0
        path_length = 0
        last_pos = np.array(p.getBasePositionAndOrientation(self.robot_id)[0])

        log_dir = self.config.get('log_dir', 'logs')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        for i in range(self.config['max_steps']):
            current_pos, _ = p.getBasePositionAndOrientation(self.robot_id)
            current_pos = np.array(current_pos)

            error = self.target_pos - current_pos
            if np.linalg.norm(error) < self.config['tolerance']:
                print("Target reached!")
                break

            control_force = self.agent.compute(error)
            p.applyExternalForce(self.robot_id, -1, control_force, current_pos, p.WORLD_FRAME)

            p.stepSimulation()
            if not self.headless:
                time.sleep(1./240.)

            path_length += np.linalg.norm(current_pos - last_pos)
            last_pos = current_pos

            if len(p.getContactPoints(self.robot_id)) > 0:
                collisions +=1

        end_time = time.time()

        metrics = {
            'simulation_time': end_time - start_time,
            'path_efficiency': np.linalg.norm(self.target_pos - np.array(self.config['start_pos'])) / path_length if path_length > 0 else 0,
            'collision_rate': collisions / self.config['max_steps'],
        }

        print("Simulation metrics:", metrics)

        # Save summary
        with open(os.path.join(log_dir, 'summary.json'), 'w') as f:
            json.dump(metrics, f, indent=2)

        # Save a screenshot
        if not self.headless:
            p.getScreenshot(os.path.join(log_dir, 'final_view.png'))

        p.disconnect()
        return metrics

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True, help='Path to the experiment config file')
    parser.add_argument('--headless', action='store_true', help='Run in headless mode')
    args = parser.parse_args()

    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)

    env = SimEnv(config, headless=args.headless)
    env.run_simulation()

if __name__ == '__main__':
    main()