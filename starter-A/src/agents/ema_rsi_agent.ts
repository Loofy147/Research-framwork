import { EMA, RSI } from 'technicalindicators';

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AgentParams {
  emaPeriod: number;
  rsiPeriod: number;
  rsiOverbought: number;
  rsiOversold: number;
}

export class EmaRsiAgent {
  private params: AgentParams;

  constructor(params: AgentParams) {
    this.params = params;
  }

  run(candles: Candle[]): { signals: ('buy' | 'sell' | 'hold')[], pnl: number[], metrics: any } {
    const closes = candles.map(c => c.close);
    const ema = EMA.calculate({ period: this.params.emaPeriod, values: closes });
    const rsi = RSI.calculate({ period: this.params.rsiPeriod, values: closes });

    // Align data by padding shorter arrays
    const maxLength = Math.max(ema.length, rsi.length);
    while (ema.length < maxLength) ema.unshift(NaN);
    while (rsi.length < maxLength) rsi.unshift(NaN);

    let signals: ('buy' | 'sell' | 'hold')[] = new Array(candles.length).fill('hold');
    let pnl: number[] = new Array(candles.length).fill(0);
    let trades = 0;
    let wins = 0;
    let lastBuyPrice = 0;

    for (let i = 1; i < candles.length; i++) {
      const currentEma = ema[i];
      const currentRsi = rsi[i];
      const currentPrice = candles[i].close;

      if (isNaN(currentEma) || isNaN(currentRsi)) {
        continue;
      }

      if (currentPrice > currentEma && currentRsi < this.params.rsiOversold) {
        signals[i] = 'buy';
        if(lastBuyPrice === 0) { // Avoid re-buying
            lastBuyPrice = currentPrice;
            trades++;
        }
      } else if (currentPrice < currentEma && currentRsi > this.params.rsiOverbought) {
        signals[i] = 'sell';
        if(lastBuyPrice > 0) { // Can only sell if we have bought
            pnl[i] = currentPrice - lastBuyPrice;
            if(currentPrice > lastBuyPrice) wins++;
            lastBuyPrice = 0;
        }
      }
    }

    return {
      signals,
      pnl,
      metrics: {
        totalTrades: trades,
        winRate: trades > 0 ? (wins / trades) : 0
      }
    };
  }
}