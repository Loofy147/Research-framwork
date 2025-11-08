/**
 * @file Implements an adversarial agent that corrupts text by inserting typos.
 */

import { AdversarialVariantBase } from './AdversarialVariant.js';
import type { Context } from '../types.js';

/**
 * @class CorruptedTextAdversary
 * @description An adversarial agent that takes a clean text context and introduces
 * random character manipulations to simulate typos or data corruption.
 */
export class CorruptedTextAdversary extends AdversarialVariantBase {
  /**
   * Creates an instance of CorruptedTextAdversary.
   */
  constructor() {
    super('CorruptedTextAdversary');
  }

  /**
   * Generates a challenging context by corrupting the initial text.
   * @param {Context} initialContext - The initial context containing the clean text.
   * @returns {Promise<Context>} A new context with the corrupted text.
   */
  public async generateContext(initialContext: Context): Promise<Context> {
    const text = initialContext.initial_text as string;
    let corruptedText = '';
    for (const char of text) {
      // 20% chance to replace a character with a random one
      if (Math.random() < 0.2) {
        corruptedText += String.fromCharCode(Math.floor(Math.random() * (126 - 32)) + 32);
      } else {
        corruptedText += char;
      }
    }
    return { ...initialContext, initial_text: corruptedText };
  }
}
