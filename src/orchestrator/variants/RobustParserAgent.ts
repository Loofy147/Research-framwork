/**
 * @file Implements an agent that attempts to parse text robustly, filtering out noise.
 */

import type { Context, PerformanceMetrics } from '../types.js';
import { AgentVariantBase } from './AgentVariant.js';

/**
 * @class RobustParserAgent
 * @description An agent designed to process text that may contain irrelevant characters
 * or "noise." It attempts to extract the meaningful content.
 */
export class RobustParserAgent extends AgentVariantBase {
  /**
   * Creates an instance of RobustParserAgent.
   */
  constructor() {
    super('RobustParserAgent');
  }

  /**
   * Runs the agent's logic to parse and clean the provided text.
   * @param {Context} context - The context containing the (potentially corrupted) text.
   * @returns {Promise<PerformanceMetrics>} The performance metrics, including the cleaned text.
   */
  public async run(context: Context): Promise<PerformanceMetrics> {
    const text = context.initial_text as string;
    // Improved robust parsing: filter out anything that's not a letter, number, or space.
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, '');
    return { cleaned_text: cleanedText, characters_removed: text.length - cleanedText.length };
  }
}
