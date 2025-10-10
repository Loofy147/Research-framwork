/**
 * @file Unit tests for the configuration loader.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import yaml from 'js-yaml';
import { loadConfig } from './configLoader.js';

// Mock the fs and yaml modules
vi.mock('fs');
vi.mock('js-yaml');

describe('loadConfig', () => {
  const validYamlContent = `
experiments:
  - name: "Test Experiment"
    type: "adversarial_benchmark"
    adversarialVariant: "TestAdversary"
    targetVariants: ["TestTarget"]
    context: {}
`;

  const invalidYamlContent = `
experiment: {} # Wrong key
`;

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should load and parse a valid config.yaml file', () => {
    // Arrange
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(validYamlContent);
    const mockConfig = {
      experiments: [
        {
          name: 'Test Experiment',
          type: 'adversarial_benchmark',
          adversarialVariant: 'TestAdversary',
          targetVariants: ['TestTarget'],
          context: {},
        },
      ],
    };
    vi.spyOn(yaml, 'load').mockReturnValue(mockConfig);

    // Act
    const config = loadConfig();

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('config.yaml'));
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('config.yaml'), 'utf8');
    expect(yaml.load).toHaveBeenCalledWith(validYamlContent);
    expect(config).toEqual(mockConfig);
    expect(config.experiments).toHaveLength(1);
  });

  it('should throw an error if config.yaml is not found', () => {
    // Arrange
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act & Assert
    expect(() => loadConfig()).toThrow('Configuration file not found');
  });

  it('should throw an error if the config file has an invalid format', () => {
    // Arrange
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(invalidYamlContent);
    // Simulate yaml.load returning an object without the 'experiments' array
    const invalidConfig = { experiment: {} };
    vi.spyOn(yaml, 'load').mockReturnValue(invalidConfig);

    // Act & Assert
    expect(() => loadConfig()).toThrow('Invalid configuration format: "experiments" array is missing.');
  });

  it('should throw an error if yaml parsing fails', () => {
    // Arrange
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(validYamlContent);
    const parsingError = new Error('YAML parsing error');
    vi.spyOn(yaml, 'load').mockImplementation(() => {
      throw parsingError;
    });

    // Act & Assert
    expect(() => loadConfig()).toThrow('Failed to load or parse config.yaml: YAML parsing error');
  });
});