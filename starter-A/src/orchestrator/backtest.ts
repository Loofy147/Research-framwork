import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { EmaRsiAgent } from '../agents/ema_rsi_agent.js';

// --- Helper Functions ---
function loadConfig(configPath: string) {
  const file = fs.readFileSync(configPath, 'utf8');
  return YAML.parse(file);
}

function generateCandles(days: number, initialPrice: number): any[] {
    const candles = [];
    let price = initialPrice;
    const startTime = new Date().getTime() - days * 24 * 60 * 60 * 1000;
    for (let i = 0; i < days * 24; i++) { // Hourly candles
        const open = price;
        const close = price + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        candles.push({ timestamp: startTime + i * 60 * 60 * 1000, open, high, low, close, volume: Math.random() * 100 });
        price = close;
    }
    return candles;
}

function writeResults(outputDir: string, results: any) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const { candles, signals, pnl, metrics } = results;

    // CSV Output
    const csvHeader = "timestamp,open,high,low,close,volume,signal,pnl\n";
    const csvRows = candles.map((c: any, i: number) =>
        `${new Date(c.timestamp).toISOString()},${c.open},${c.high},${c.low},${c.close},${c.volume},${signals[i]},${pnl[i]}`
    ).join('\n');
    fs.writeFileSync(path.join(outputDir, 'results.csv'), csvHeader + csvRows);

    // Summary Markdown
    const summary = `
# Backtest Summary
- **Total Trades**: ${metrics.totalTrades}
- **Win Rate**: ${(metrics.winRate * 100).toFixed(2)}%
- **Config**: \`\`\`json\n${JSON.stringify(results.config, null, 2)}\n\`\`\`
`;
    fs.writeFileSync(path.join(outputDir, 'summary.md'), summary.trim());
}


// --- Main Execution ---
async function main() {
    const args = process.argv.slice(2);
    const configPath = args.find(arg => arg.endsWith('.yaml'));
    if (!configPath) {
        console.error("Error: Path to a .yaml config file is required.");
        process.exit(1);
    }

    const config = loadConfig(configPath);
    const agentParams = config.agent.params;
    const simParams = config.simulation;

    const agent = new EmaRsiAgent(agentParams);
    const candles = generateCandles(simParams.days, simParams.initialPrice);

    console.log(`Running backtest for ${simParams.days} days...`);
    const { signals, pnl, metrics } = agent.run(candles);

    const outputDir = config.output?.directory || './output';
    writeResults(outputDir, { candles, signals, pnl, metrics, config });

    console.log(`Backtest complete. Results saved to ${outputDir}`);
}

main().catch(console.error);