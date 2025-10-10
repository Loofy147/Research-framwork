/**
 * @file Handles the generation of experiment summary reports.
 */

import fs from 'fs';
import path from 'path';
import type { PerformanceMetrics } from './types.js';

/**
 * Generates a markdown summary of the experiment results.
 *
 * @param {string} experimentName - The name of the experiment.
 * @param {Map<string, PerformanceMetrics>} results - A map of performance metrics for each variant.
 * @returns {string} The formatted markdown string.
 */
function generateMarkdownReport(
  experimentName: string,
  results: Map<string, PerformanceMetrics>
): string {
  let report = `# Experiment Summary: "${experimentName}"\n\n`;
  report += `**Date:** ${new Date().toUTCString()}\n\n`;
  report += '---\n\n';

  if (results.size === 0) {
    report += 'No results were generated for this experiment.\n';
    return report;
  }

  results.forEach((metrics, variantName) => {
    report += `## Variant: \`${variantName}\`\n\n`;
    report += '| Metric | Value |\n';
    report += '|--------|-------|\n';
    for (const [key, value] of Object.entries(metrics)) {
      const displayValue = JSON.stringify(value, null, 2);
      report += `| ${key} | \`${displayValue}\` |\n`;
    }
    report += '\n';
  });

  return report;
}

/**
 * Writes the experiment summary report to a `summary.md` file in the project root.
 *
 * @param {string} experimentName - The name of the experiment.
 * @param {Map<string, PerformanceMetrics>} results - The results from the experiment.
 */
export function writeSummaryReport(
  experimentName: string,
  results: Map<string, PerformanceMetrics>
): void {
  try {
    const reportContent = generateMarkdownReport(experimentName, results);
    const reportPath = path.join(process.cwd(), 'summary.md');
    fs.writeFileSync(reportPath, reportContent, 'utf8');
    console.log(`[Reporting] Summary report saved to: ${reportPath}`);
  } catch (error) {
    console.error('[Reporting] Failed to write summary report.');
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}