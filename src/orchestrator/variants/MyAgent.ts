import { AgentVariant, Context, PerformanceMetrics } from '../types.js';

export class MyAgent implements AgentVariant {
  name = 'my-agent-v1';
  async run(ctx: Context): Promise<PerformanceMetrics> {
    // A simple agent that returns a successful status and some example metrics.
    return {
      status: 'ok',
      metrics: {
        success: 0.8,
        latency: 120
      }
    };
  }
}