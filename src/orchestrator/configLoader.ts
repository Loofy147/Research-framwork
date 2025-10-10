/**
 * @file Handles loading and parsing of the project's configuration file.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Experiment, AdversarialExperiment } from './types.js';

/**
 * Defines the structure of the main configuration file.
 */
interface Config {
  experiments: (Experiment | AdversarialExperiment)[];
}

/**
 * Loads and parses the `config.yaml` file from the project root.
 *
 * @returns {Config} The parsed configuration object.
 * @throws {Error} If the `config.yaml` file is not found or is invalid.
 */
export function loadConfig(): Config {
  const configPath = path.join(process.cwd(), 'config.yaml');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at: ${configPath}`);
  }

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents) as Config;

    if (!config || !Array.isArray(config.experiments)) {
      throw new Error('Invalid configuration format: "experiments" array is missing.');
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load or parse config.yaml: ${error.message}`);
    }
    throw new Error('An unknown error occurred while loading the configuration.');
  }
}