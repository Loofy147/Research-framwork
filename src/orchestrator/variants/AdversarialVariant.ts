/**
 * @file Implements the abstract base class for an Adversarial Agent Variant.
 */

import type { Context, PerformanceMetrics } from '../types.js';
import { AgentVariantBase } from './AgentVariant.js';

/**
 * @abstract
 * @class AdversarialVariantBase
 * @extends {AgentVariantBase}
 * @description An abstract base class for adversarial agents. Unlike standard agents,
 * their primary goal is to generate a challenging `context` for other agents,
 * rather than producing performance metrics.
 */
export abstract class AdversarialVariantBase extends AgentVariantBase {
  /**
   * The `run` method is overridden to prevent adversarial variants from being executed
   * like standard agents. Their purpose is context generation, not task execution.
   * @param {Context} _context - The input context (ignored).
   * @returns {Promise<PerformanceMetrics>}
   * @throws {Error} Always throws an error indicating the correct method to use.
   */
  public run(_context: Context): Promise<PerformanceMetrics> {
    throw new Error(
      `Adversarial variants cannot be "run". Use "generateContext" instead.`
    );
  }

  /**
   * Generates a difficult or tricky context designed to test the robustness of other agents.
   * This is the core method for all adversarial variants.
   *
   * @abstract
   * @param {Context} [initialContext] - An optional initial context to base the adversarial task on.
   * @returns {Promise<Context>} A promise that resolves to the generated adversarial context.
   */
  public abstract generateContext(initialContext?: Context): Promise<Context>;
}