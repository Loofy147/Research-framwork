// This is a placeholder for a real exchange connector.
// In a real-world scenario, this module would handle communication
// with a brokerage API (e.g., Alpaca, Binance).

interface Order {
  symbol: string;
  quantity: number;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
}

export class MockExchangeConnector {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    console.log("MockExchangeConnector initialized.");
  }

  async submitOrder(order: Order): Promise<{ orderId: string; status: string }> {
    console.log(`[Mock Exchange] Submitting order:`, order);
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate a successful order submission
    const orderId = `mock_${Date.now()}`;
    console.log(`[Mock Exchange] Order ${orderId} submitted successfully.`);

    return {
      orderId,
      status: 'accepted'
    };
  }

  async getOrderStatus(orderId: string): Promise<{ status: 'filled' | 'pending' | 'failed' }> {
    console.log(`[Mock Exchange] Checking status for order ${orderId}`);
    // Simulate a filled order
    return { status: 'filled' };
  }
}