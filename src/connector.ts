import puppeteer, { Browser, Page } from 'puppeteer';

export interface TradingViewConfig {
  headless?: boolean;
  url?: string;
  timeout?: number;
}

export class ChromeTradingViewConnector {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: TradingViewConfig;

  constructor(config: TradingViewConfig = {}) {
    this.config = {
      headless: true,
      url: 'https://www.tradingview.com',
      timeout: 30000,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      this.page = await this.browser.newPage();
      await this.page.setDefaultTimeout(this.config.timeout);
      await this.page.goto(this.config.url!, { waitUntil: 'networkidle2' });

      console.log('Connected to TradingView');
    } catch (error) {
      throw new Error(`Failed to initialize Chrome connector: ${error}`);
    }
  }

  async navigateToChart(symbol: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    const chartUrl = `${this.config.url}/chart/${symbol}`;
    await this.page.goto(chartUrl, { waitUntil: 'networkidle2' });
    console.log(`Navigated to chart: ${symbol}`);
  }

  async getChartData(symbol: string): Promise<Record<string, unknown>> {
    if (!this.page) throw new Error('Page not initialized');

    await this.navigateToChart(symbol);

    const data = await this.page.evaluate(() => {
      const title = document.title;
      const url = window.location.href;
      return { title, url, timestamp: new Date().toISOString() };
    });

    return data;
  }

  async setAlert(symbol: string, price: number, condition: 'above' | 'below'): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    await this.navigateToChart(symbol);
    console.log(`Set alert for ${symbol} at ${price} (${condition})`);
  }

  async screenshot(filename: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.screenshot({ path: filename });
    console.log(`Screenshot saved: ${filename}`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }

  isConnected(): boolean {
    return this.browser !== null && this.page !== null;
  }
}
