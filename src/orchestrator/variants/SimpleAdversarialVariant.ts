/**
 * @file Implements a simple concrete Adversarial Agent Variant.
 */

import type { Context } from '../types';
import { AdversarialVariantBase } from './AdversarialVariant';

/**
 * @class SimpleAdversarialVariant
 * @extends {AdversarialVariantBase}
 * @description A basic implementation of an adversarial agent.
 * Its purpose is to generate a task description that is unusually long and contains
 * irrelevant details, testing a target agent's ability to extract key information.
 */
export class SimpleAdversarialVariant extends AdversarialVariantBase {
  /**
   * Creates an instance of SimpleAdversarialVariant.
   */
  constructor() {
    super('SimpleAdversarialVariant');
  }

  /**
   * Generates a context with a very long and nonsensical task description.
   * @param {Context} [initialContext] - An optional initial context. If provided, its properties
   * will be merged into the new context.
   * @returns {Promise<Context>} A promise that resolves to the generated adversarial context.
   */
  public async generateContext(initialContext?: Context): Promise<Context> {
    const nonsensicalDescription = `
      This is a task of utmost importance, requiring immediate attention. The primary objective is to parse the following data string: 'user_id:12345,action:login'. However, before you proceed, it is critical to consider the geopolitical implications of asynchronous processing in a distributed system. The lorem ipsum generator has produced the following text for your consideration: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Also, remember that the sky is blue on a sunny day, and penguins are flightless birds. The core requirement, which is easy to miss, is to extract the 'action' value from the data string. Please complete this task while adhering to all corporate guidelines regarding font usage and coffee consumption. The final output should be just the action itself, nothing more.
    `;

    const newContext: Context = {
      ...initialContext,
      taskDescription: nonsensicalDescription,
      dataString: 'user_id:12345,action:login',
      difficulty: 'high',
    };

    return Promise.resolve(newContext);
  }
}