import axios, { AxiosInstance } from 'axios';

export interface ClientConfig {
  baseURL?: string;
  timeout?: number;
}

export class TradingViewClient {
  private client: AxiosInstance;

  constructor(config: ClientConfig = {}) {
    const baseURL = config.baseURL || 'http://localhost:3000';
    const timeout = config.timeout || 10000;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getHealth() {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getStatus() {
    const response = await this.client.get('/status');
    return response.data;
  }

  async getChartData(symbol: string) {
    const response = await this.client.post(`/chart/${symbol}`);
    return response.data;
  }

  async setAlert(symbol: string, price: number, condition: 'above' | 'below') {
    const response = await this.client.post('/alert', {
      symbol,
      price,
      condition,
    });
    return response.data;
  }

  async takeScreenshot(filename?: string) {
    const response = await this.client.post('/screenshot', { filename });
    return response.data;
  }

  async isConnected() {
    try {
      const health = await this.getHealth();
      return health.connected;
    } catch {
      return false;
    }
  }
}

export async function createClient(config?: ClientConfig) {
  return new TradingViewClient(config);
}
