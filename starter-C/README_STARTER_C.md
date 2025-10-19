# Starter C: PyBullet PID Navigation

This project demonstrates a simple robotics simulation where an agent uses a PID controller to navigate from a starting point to a target point in a PyBullet environment.

## How to Run

1.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the simulation:**
    ```bash
    python sim_env.py --config experiment_config.yaml
    ```

## What it Does

-   **Initializes a PyBullet Environment:** Sets up a simple world with a ground plane and an R2-D2 robot.
-   **PID Agent:** The `AgentPID` class implements a Proportional-Integral-Derivative controller.
-   **Runs the Simulation:** The agent computes forces based on the error between its current position and the target, and applies these forces to the robot.
-   **Outputs Results:**
    -   Prints simulation metrics like `simulation_time`, `path_efficiency`, and `collision_rate` to the console.
    -   Saves a screenshot of the final state to `logs/final_view.png` if `render` is true in the config.

## Configuration

The simulation is configured via `experiment_config.yaml`. You can change the start/target positions, PID gains, and other simulation parameters.