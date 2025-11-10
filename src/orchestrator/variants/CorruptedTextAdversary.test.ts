/**
 * @file Unit tests for the CorruptedTextAdversary.
 */

import { describe, it, expect } from 'vitest';
import { CorruptedTextAdversary } from './CorruptedTextAdversary.js';
import type { Context } from '../types.js';

describe('CorruptedTextAdversary', () => {
  it('should corrupt the initial text', async () => {
    const adversary = new CorruptedTextAdversary();
    const initialContext: Context = { initial_text: 'hello world' };
    const corruptedContext = await adversary.generateContext(initialContext);
    expect(corruptedContext.initial_text).not.toEqual('hello world');
  });

  it('should return a context with the same keys', async () => {
    const adversary = new CorruptedTextAdversary();
    const initialContext: Context = { initial_text: 'hello world', other_key: 'test' };
    const corruptedContext = await adversary.generateContext(initialContext);
    expect(Object.keys(corruptedContext)).toEqual(Object.keys(initialContext));
  });
});
