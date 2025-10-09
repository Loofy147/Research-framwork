/**
 * @file Implements the MetaOrchestrator for running AI agent experiments.
 */

import type { AgentVariant, Experiment, AdversarialExperiment, Context, PerformanceMetrics } from './types';
import { AdversarialVariantBase } from './variants/AdversarialVariant';

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
    const results = new Map<string, PerformanceMetrics>();
    for (const variantName of experiment.variants) {
      const variant = this.getVariant(variantName);
      const metrics = await variant.run(experiment.context);
      results.set(variantName, metrics);
    }
    return results;
  }

  /**
   * Runs an adversarial benchmark experiment.
   * An adversarial agent first generates a challenging context, and then target agents are run against it.
   * @param {AdversarialExperiment} experiment - The adversarial experiment configuration.
   * @returns {Promise<Map<string, PerformanceMetrics>>} A map of performance metrics for each target variant.
   */
  public async runAdversarialBenchmark(experiment: AdversarialExperiment): Promise<Map<string, PerformanceMetrics>> {
    const adversarialVariant = this.getVariant(experiment.adversarialVariant);

    if (!(adversarialVariant instanceof AdversarialVariantBase)) {
      throw new Error(`Variant "${experiment.adversarialVariant}" is not an adversarial variant.`);
    }

    // 1. The adversarial agent generates the challenging context.
    const challengingContext = await adversarialVariant.generateContext(
      experiment.context
    );

    // 2. The target agents are run against the new context.
    const results = new Map<string, PerformanceMetrics>();
    for (const variantName of experiment.targetVariants) {
      const variant = this.getVariant(variantName);
      const metrics = await variant.run(challengingContext);
      results.set(variantName, metrics);
    }
    return results;
  }
}