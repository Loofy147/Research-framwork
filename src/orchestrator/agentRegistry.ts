/**
 * @file Handles the registration of all available agent variants.
 * In a real-world application, this could be extended to dynamically discover
 * agents from a directory or a configuration file.
 */

import { MetaOrchestrator } from './Orchestrator.js';
import { SimpleAdversarialVariant } from './variants/SimpleAdversarialVariant.js';
import { BasicParserAgent } from './variants/BasicParserAgent.js';
import { MyAgent } from './variants/MyAgent.js';

/**
 * Registers all known agent variants with the provided orchestrator instance.
 *
 * @param {MetaOrchestrator} orchestrator - The orchestrator instance to register agents with.
 */
export function registerAllAgents(orchestrator: MetaOrchestrator): void {
  // Register adversarial agents
  orchestrator.registerVariant(new SimpleAdversarialVariant());

  // Register target agents
  orchestrator.registerVariant(new BasicParserAgent());
  orchestrator.registerVariant(new MyAgent());

  // To add a new agent, you would simply instantiate it and register it here.
  // e.g., orchestrator.registerVariant(new MyNewAgent());
}