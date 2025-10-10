/**
 * @file Implements the MetaOrchestrator for running AI agent experiments.
 */

import type { AgentVariant, Experiment, AdversarialExperiment, Context, PerformanceMetrics } from './types.js';
import { AdversarialVariantBase } from './variants/AdversarialVariant.js';

/**
 * @class MetaOrchestrator
 * @description Manages the execution of experiments involving various AI agent variants.
 * It can run standard benchmarks as well as adversarial benchmarks.
 */
export class MetaOrchestrator {
  /**
   * A registry of available agent variants, mapped by their names.
   * @private
   * @type {Map<string, AgentVariant>}
   */
  private variants: Map<string, AgentVariant> = new Map();

  /**
   * Registers a new agent variant with the orchestrator.
   * @param {AgentVariant} variant - The agent variant to register.
   * @throws {Error} If a variant with the same name is already registered.
   */
  public registerVariant(variant: AgentVariant): void {
    if (this.variants.has(variant.name)) {
      throw new Error(`Variant with name "${variant.name}" is already registered.`);
    }
    this.variants.set(variant.name, variant);
  }

  /**
   * Retrieves a registered agent variant by its name.
   * @param {string} name - The name of the variant to retrieve.
   * @returns {AgentVariant} The found agent variant.
   * @throws {Error} If no variant with the given name is found.
   */
  private getVariant(name: string): AgentVariant {
    const variant = this.variants.get(name);
    if (!variant) {
      throw new Error(`Variant "${name}" not found.`);
    }
    return variant;
  }

  /**
   * Runs a standard experiment, testing a list of variants against a common context.
   * @param {Experiment} experiment - The experiment configuration.
   * @returns {Promise<Map<string, PerformanceMetrics>>} A map of performance metrics for each variant.
   */
  public async runStandardExperiment(experiment: Experiment): Promise<Map<string, PerformanceMetrics>> {
    const experimentTimerLabel = `[Orchestrator] Standard experiment "${experiment.name}"`;
    console.time(experimentTimerLabel);
    console.log(`[Orchestrator] Starting standard experiment: "${experiment.name}"`);

    const promises = experiment.variants.map(async (variantName) => {
      console.log(`  - Running variant: ${variantName}`);
      const variant = this.getVariant(variantName);
      const metrics = await variant.run(experiment.context);
      return [variantName, metrics] as [string, PerformanceMetrics];
    });

    const resultsArray = await Promise.all(promises);
    const results = new Map<string, PerformanceMetrics>(resultsArray);

    console.timeEnd(experimentTimerLabel);
    return results;
  }

  /**
   * Runs an adversarial benchmark experiment.
   * An adversarial agent first generates a challenging context, and then target agents are run against it.
   * @param {AdversarialExperiment} experiment - The adversarial experiment configuration.
   * @returns {Promise<Map<string, PerformanceMetrics>>} A map of performance metrics for each target variant.
   */
  public async runAdversarialBenchmark(experiment: AdversarialExperiment): Promise<Map<string, PerformanceMetrics>> {
    const experimentTimerLabel = `[Orchestrator] Adversarial benchmark "${experiment.name}"`;
    console.time(experimentTimerLabel);
    console.log(`[Orchestrator] Starting adversarial benchmark: "${experiment.name}"`);

    const adversarialVariant = this.getVariant(experiment.adversarialVariant);
    if (!(adversarialVariant instanceof AdversarialVariantBase)) {
      throw new Error(`Variant "${experiment.adversarialVariant}" is not an adversarial variant.`);
    }

    // 1. The adversarial agent generates the challenging context.
    console.log(`  - Generating context with adversarial variant: ${adversarialVariant.name}`);
    const challengingContext = await adversarialVariant.generateContext(
      experiment.context
    );
    console.log(`  - Context generated successfully.`);

    // 2. The target agents are run against the new context.
    const promises = experiment.targetVariants.map(async (variantName) => {
      console.log(`  - Running target variant: ${variantName}`);
      const variant = this.getVariant(variantName);
      const metrics = await variant.run(challengingContext);
      return [variantName, metrics] as [string, PerformanceMetrics];
    });

    const resultsArray = await Promise.all(promises);
    const results = new Map<string, PerformanceMetrics>(resultsArray);

    console.timeEnd(experimentTimerLabel);
    return results;
  }
}