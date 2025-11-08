/**
 * @file Implements the MetaOrchestrator for running AI agent experiments.
 */

import type { AgentVariant, Experiment, AdversarialExperiment, Context, PerformanceMetrics } from './types.js';
import { AdversarialVariantBase } from './variants/AdversarialVariant.js';
import logger from '../utils/logger.js';

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
    logger.info({ experiment: experiment.name }, `Starting standard experiment...`);
    const startTime = Date.now();

    const promises = experiment.agents.map(async (agentConfig) => {
      try {
        const variant = this.getVariant(agentConfig.variant);
        logger.info({ variant: variant.name }, `Running variant...`);
        const metrics = await variant.run(experiment.context);
        return [agentConfig.variant, metrics] as [string, PerformanceMetrics];
      } catch (error) {
        logger.error({ error, variant: agentConfig.variant }, `Variant run failed.`);
        return [agentConfig.variant, { error: (error as Error).message }] as [string, PerformanceMetrics];
      }
    });

    const resultsArray = await Promise.all(promises);
    const results = new Map<string, PerformanceMetrics>(resultsArray);

    logger.info({ experiment: experiment.name, duration: Date.now() - startTime }, `Standard experiment finished.`);
    return results;
  }

  /**
   * Runs an adversarial benchmark experiment.
   * An adversarial agent first generates a challenging context, and then target agents are run against it.
   * @param {AdversarialExperiment} experiment - The adversarial experiment configuration.
   * @returns {Promise<Map<string, PerformanceMetrics>>} A map of performance metrics for each target variant.
   */
  public async runAdversarialBenchmark(experiment: AdversarialExperiment): Promise<Map<string, PerformanceMetrics>> {
    logger.info({ experiment: experiment.name }, `Starting adversarial benchmark...`);
    const startTime = Date.now();

    try {
      const adversarialVariant = this.getVariant(experiment.adversarialVariant);
      if (!(adversarialVariant instanceof AdversarialVariantBase)) {
        throw new Error(`Variant "${experiment.adversarialVariant}" is not an adversarial variant.`);
      }

      logger.info({ variant: adversarialVariant.name }, `Generating context with adversarial variant...`);
      const challengingContext = await adversarialVariant.generateContext(experiment.context);
      logger.info(`Context generated successfully.`);

      const promises = experiment.targetVariants.map(async (variantName) => {
        try {
          const variant = this.getVariant(variantName);
          logger.info({ variant: variant.name }, `Running target variant...`);
          const metrics = await variant.run(challengingContext);
          return [variantName, metrics] as [string, PerformanceMetrics];
        } catch (error) {
          logger.error({ error, variant: variantName }, `Target variant run failed.`);
          return [variantName, { error: (error as Error).message }] as [string, PerformanceMetrics];
        }
      });

      const resultsArray = await Promise.all(promises);
      const results = new Map<string, PerformanceMetrics>(resultsArray);

      logger.info({ experiment: experiment.name, duration: Date.now() - startTime }, `Adversarial benchmark finished.`);
      return results;

    } catch (error) {
      logger.error({ error, experiment: experiment.name }, `Adversarial benchmark failed.`);
      return new Map();
    }
  }
}
