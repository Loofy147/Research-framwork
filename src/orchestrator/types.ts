/**
 * @file Defines the core types and interfaces for the meta-orchestrator framework.
 * These structures form the data contracts for running experiments with AI agent variants.
 */

/**
 * Represents the input, state, and environment for an agent task.
 * This is a flexible container for any data an agent might need to perform its work.
 * It can be extended with specific properties for different types of tasks.
 */
export interface Context {
  [key: string]: any;
}

/**
 * Defines the performance metrics or output of an agent's run.
 * The structure is flexible to accommodate various scoring or result-tracking mechanisms.
 */
export interface PerformanceMetrics {
  [key: string]: any;
}

/**
 * Represents a specific implementation or version of an AI agent.
 * Each variant must be able to run a task defined by a given context.
 */
export interface AgentVariant {
  /**
   * A unique identifier for the agent variant.
   * @type {string}
   */
  name: string;

  /**
   * Executes the agent's logic on a given task context.
   * @param {Context} context - The input data and environment for the task.
   * @returns {Promise<PerformanceMetrics>} A promise that resolves to the performance
   * results of the run.
   */
  run(context: Context): Promise<PerformanceMetrics>;
}

/**
 * Describes a single experiment to be run by the orchestrator.
 * It specifies the agent variants to be tested and the context they will run in.
 */
export interface Experiment {
  /**
   * A unique name for the experiment.
   * @type {string}
   */
  name: string;

  /**
   * The list of agent variants to be included in the experiment.
   * @type {any[]}
   */
  agents: any[];

  /**
   * The initial context or task definition for the experiment.
   * @type {Context}
   */
  context: Context;
}

/**
 * Defines a specialized experiment for adversarial benchmarking.
 * It pits one adversarial agent against a set of target agents.
 */
export interface AdversarialExperiment extends Experiment {
  /**
   * The name of the adversarial variant that generates the task context.
   * @type {string}
   */
  adversarialVariant: string;

  /**
   * The list of target agent variants to be tested against the generated context.
   * @type {string[]}
   */
  targetVariants: string[];
}