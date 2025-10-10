/**
 * @file Implements the abstract base class for an Agent Variant.
 */

import type { AgentVariant as IAgentVariant, Context, PerformanceMetrics } from '../types.js';

/**
 * @abstract
 * @class AgentVariantBase
 * @implements {IAgentVariant}
 * @description An abstract base class that provides the foundational structure for all agent variants.
 * Concrete agent implementations should extend this class.
 */
export abstract class AgentVariantBase implements IAgentVariant {
  /**
   * The unique name of the agent variant.
   * @public
   * @type {string}
   */
  public readonly name: string;

  /**
   * Creates an instance of AgentVariantBase.
   * @param {string} name - The name for the variant.
   */
  constructor(name: string) {
    if (!name) {
      throw new Error('Agent variant must have a name.');
    }
    this.name = name;
  }

  /**
   * The core logic of the agent variant. This method must be implemented by all subclasses.
   * It takes a context, performs a task, and returns performance metrics.
   * @abstract
   * @param {Context} context - The input data and environment for the task.
   * @returns {Promise<PerformanceMetrics>} A promise that resolves with the performance results.
   */
  public abstract run(context: Context): Promise<PerformanceMetrics>;
}