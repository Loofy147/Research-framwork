/**
 * @file Implements a basic concrete Target Agent Variant.
 */

import type { Context, PerformanceMetrics } from '../types.js';
import { AgentVariantBase } from './AgentVariant.js';

/**
 * @class BasicParserAgent
 * @extends {AgentVariantBase}
 * @description A simple agent designed to parse a key-value string from the context.
 * It serves as a basic target for adversarial benchmarks.
 */
export class BasicParserAgent extends AgentVariantBase {
  /**
   * Creates an instance of BasicParserAgent.
   */
  constructor() {
    super('BasicParserAgent');
  }

  /**
   * Runs the parsing logic on the given context.
   * It looks for a `dataString` in the context, attempts to extract an 'action' value,
   * and returns metrics about the operation.
   * @param {Context} context - The input context, expected to contain a `dataString`.
   * @returns {Promise<PerformanceMetrics>} A promise that resolves to the performance metrics.
   */
  public async run(context: Context): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    let action: string | null = null;
    let error: string | null = null;
    let success = false;

    try {
      if (typeof context.dataString !== 'string') {
        throw new Error('Context is missing the required "dataString" property.');
      }

      const parts = context.dataString.split(',');
      const actionPart = parts.find(part => part.startsWith('action:'));

      if (!actionPart) {
        throw new Error("The 'action:' field was not found in the dataString.");
      }

      action = actionPart.split(':')[1];
      if (typeof action !== 'string' || action.length === 0) {
        throw new Error("The 'action' value is present but empty.");
      }

      success = true;

    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unknown error occurred during parsing.';
      }
    }

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    return {
      success,
      actionExtracted: action,
      durationMs,
      error,
    };
  }
}