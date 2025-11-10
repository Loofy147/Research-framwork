/**
 * @file Unit tests for the RobustParserAgent.
 */

import { describe, it, expect } from 'vitest';
import { RobustParserAgent } from './RobustParserAgent.js';
import type { Context } from '../types.js';

describe('RobustParserAgent', () => {
  it('should clean corrupted text', async () => {
    const agent = new RobustParserAgent();
    const context: Context = { initial_text: 'h3ll0 w0rld!' };
    const metrics = await agent.run(context);
    expect(metrics.cleaned_text).toEqual('h3ll0 w0rld');
  });

  it('should count removed characters', async () => {
    const agent = new RobustParserAgent();
    const context: Context = { initial_text: 'h3ll0 w0rld!' };
    const metrics = await agent.run(context);
    expect(metrics.characters_removed).toEqual(1);
  });
});
