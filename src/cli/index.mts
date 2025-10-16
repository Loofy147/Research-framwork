/**
 * @file The command-line interface for the MetaOrchestrator framework.
 * This script allows users to run experiments from the command line.
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { MetaOrchestrator } from '../orchestrator/Orchestrator.js';
import { loadConfig } from '../orchestrator/configLoader.js';
import { writeSummaryReport } from '../orchestrator/reporting.js';
import { registerAllAgents } from '../orchestrator/agentRegistry.js';
import type { Context, PerformanceMetrics } from '../orchestrator/types.js';

async function main() {
  await yargs(hideBin(process.argv))
    .command(
      'run <experimentName>',
      'Run a specific experiment by name',
      (yargs) => {
        return yargs.positional('experimentName', {
          describe: 'The name of the experiment to run from config.yaml',
          type: 'string',
        });
      },
      async (argv) => {
        if (!argv.experimentName) {
            console.error('Error: Experiment name is required.');
            process.exit(1);
        }

        console.log(`Attempting to run experiment: "${argv.experimentName}"`);

        try {
          // 1. Load configuration
          const config = loadConfig();
          const experiment = config.experiments.find(
            (exp) => exp.name === argv.experimentName
          );

          if (!experiment) {
            throw new Error(`Experiment "${argv.experimentName}" not found in config.yaml.`);
          }

          // 2. Initialize Orchestrator and register variants
          const orchestrator = new MetaOrchestrator();
          registerAllAgents(orchestrator);

          console.log('Orchestrator initialized and variants registered.');

          // 3. Run the experiment
          let results;
          if ('adversarialVariant' in experiment) {
            console.log('Running adversarial benchmark...');
            results = await orchestrator.runAdversarialBenchmark(experiment);
          } else {
            console.log('Running standard experiment...');
            results = await orchestrator.runStandardExperiment(experiment);
          }

          // 4. Output results
          console.log(`\n--- Experiment Results for "${experiment.name}" ---`);
          results.forEach((metrics, variantName) => {
            console.log(`\nVariant: ${variantName}`);
            console.log(JSON.stringify(metrics, null, 2));
          });
          console.log('\n--------------------------------------------------');

          // 5. Write summary report
          writeSummaryReport(experiment.name, results);

        } catch (error) {
          console.error('\nError running experiment:');
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('An unknown error occurred.');
          }
          process.exit(1);
        }
      }
    )
    .demandCommand(1, 'You must provide a command to execute.')
    .help()
    .argv;
}

main().catch((err) => {
  console.error('CLI tool failed:', err);
});