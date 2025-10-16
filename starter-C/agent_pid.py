import numpy as np

class AgentPID:
    def __init__(self, pid_params):
        self.kp = pid_params['kp']
        self.ki = pid_params['ki']
        self.kd = pid_params['kd']
        self._integral = np.zeros(3)
        self._previous_error = np.zeros(3)

    def compute(self, error):
        self._integral += error
        derivative = error - self._previous_error
        self._previous_error = error

        output = self.kp * error + self.ki * self._integral + self.kd * derivative
        return output