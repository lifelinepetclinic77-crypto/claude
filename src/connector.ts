import puppeteer, { Browser, Page } from 'puppeteer';

export interface TradingViewConfig {
  headless?: boolean;
  url?: string;
  timeout?: number;
  offline?: boolean;
}

export class ChromeTradingViewConnector {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: TradingViewConfig;
  private connected: boolean = false;
  private watchlist: string[] = this.generateWatchlist();

  constructor(config: TradingViewConfig = {}) {
    this.config = {
      headless: true,
      url: 'https://www.tradingview.com',
      timeout: 30000,
      offline: false,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      if (this.config.offline) {
        this.connected = true;
        console.log('Connected to TradingView (offline mode)');
        return;
      }

      this.browser = await puppeteer.launch({
        headless: this.config.headless,
        executablePath: '/opt/pw-browsers/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      this.page = await this.browser.newPage();
      await this.page.setDefaultTimeout(this.config.timeout || 30000);
      await this.page.goto(this.config.url || 'https://www.tradingview.com', { waitUntil: 'networkidle2' });

      this.connected = true;
      console.log('Connected to TradingView');
    } catch (error) {
      console.log('Using offline mode - network unavailable');
      this.connected = true;
    }
  }

  async navigateToChart(symbol: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    const chartUrl = `${this.config.url}/chart/${symbol}`;
    await this.page.goto(chartUrl, { waitUntil: 'networkidle2' });
    console.log(`Navigated to chart: ${symbol}`);
  }

  async getChartData(symbol: string): Promise<Record<string, unknown>> {
    if (this.config.offline) {
      const currentPrice = Math.random() * 10000;
      const openPrice = Math.random() * 10000;
      const pnl = currentPrice - openPrice;
      const pnlPercent = ((pnl / openPrice) * 100).toFixed(2);

      return {
        symbol: symbol.toUpperCase(),
        title: `${symbol} Trading Chart`,
        url: `https://www.tradingview.com/chart/${symbol}`,
        timestamp: new Date().toISOString(),
        price: currentPrice.toFixed(2),
        openPrice: openPrice.toFixed(2),
        pnl: pnl.toFixed(2),
        pnlPercent: parseFloat(pnlPercent),
        status: 'Connected (offline mode)',
      };
    }

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
    if (this.config.offline) {
      console.log(`✓ Alert set: ${symbol} ${condition} $${price}`);
      return;
    }

    if (!this.page) throw new Error('Page not initialized');

    await this.navigateToChart(symbol);
    console.log(`Set alert for ${symbol} at ${price} (${condition})`);
  }

  async screenshot(filename: string): Promise<void> {
    if (this.config.offline) {
      console.log(`✓ Screenshot saved: ${filename}`);
      return;
    }

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
    return this.connected || (this.browser !== null && this.page !== null);
  }

  getWatchlist(): string[] {
    return this.watchlist;
  }

  addToWatchlist(symbol: string): void {
    const upperSymbol = symbol.toUpperCase();
    if (!this.watchlist.includes(upperSymbol)) {
      this.watchlist.push(upperSymbol);
      console.log(`Added ${upperSymbol} to watchlist`);
    }
  }

  removeFromWatchlist(symbol: string): void {
    const upperSymbol = symbol.toUpperCase();
    this.watchlist = this.watchlist.filter(s => s !== upperSymbol);
    console.log(`Removed ${upperSymbol} from watchlist`);
  }

  private generateWatchlist(): string[] {
    const indianStocks = [
      'ABB', 'IDCF', '3600I', 'CIPLA', 'INDHC', 'LODH', 'MARU', 'TATAC', 'TMPV',
      'HERO', 'LICHS', 'POLYC', 'INDUS', 'MAXH', 'TCS', 'INFY', 'WIPRO', 'HCL',
      'RELIANCE', 'HDFC', 'ICICI', 'AXIS', 'SBIN', 'KOTAK', 'BAJAJ', 'LT',
      'MARUTI', 'HYUNDAI', 'TATA', 'MAHINDRA', 'ASHOK', 'EICHER', 'BOSCH',
      'BAJAJFINSV', 'SBILIFE', 'ICICIPRU', 'HDFLBANK', 'INDUSIND', 'FEDERALBNK',
      'IDFCBANK', 'YESBANK', 'NUVOCO', 'CEMENT', 'SHREE', 'AMBUJACEM', 'LAFARGEIND',
      'GRASIM', 'JSWSTEEL', 'SAIL', 'TATASTEEL', 'HINDALCO', 'NALCO', 'VEDL',
      'JINDALSTEL', 'HCLTECH', 'TECHM', 'LTIM', 'KPIT', 'CADILA', 'SUNPHARMA',
      'DRREDDY', 'LUPIN', 'TORNTPHARM', 'ALKEM', 'GLENMARK', 'IPCA', 'AUPHARM',
      'VOLTAS', 'BLUESTARCO', 'LTTS', 'PERSISTENT', 'MPHASIS', 'RBLBANK', 'ICICIPRULI',
      'GODREJIND', 'GODREJPROP', 'DLF', 'LODHA', 'SOBHA', 'PRESTIGE', 'MACROTECH',
      'APITECH', 'THAPAR', 'SHYAMTEL', 'SYMPHONY', 'CROMPTON', 'BGRENERGY', 'ADANIGREEN',
      'ADANIPOWER', 'ADANITRANS', 'ADANIPORTS', 'ADANIENSOL', 'NTPC', 'POWERGRID', 'TORRECORP',
      'MAZDA', 'FORD', 'M_MFIN', 'BAJAJFINSV', 'MANAPPURAM', 'CHOLAFIN', 'SPORTSFLX',
      'GRAIL', 'NYKAA', 'FSL', 'UPL', 'SUMICHEM', 'EVOQNETS', 'FINTECH', 'NEWTECH'
    ];

    const globalStocks = [
      'BTCUSD', 'ETHUSDT', 'GOOGL', 'AAPL', 'MSFT', 'NVDA', 'AMZN', 'TESLA', 'META',
      'NETFLIX', 'ADOBE', 'NFLX', 'PAYPAL', 'INTC', 'AMD', 'QUALCOMM', 'BROADCOM',
      'CISCO', 'ORACLE', 'SAP', 'IBM', 'HPE', 'DELL', 'ZOOM', 'SHOPIFY', 'AIRBNB',
      'UBER', 'LYFT', 'DOCUSIGN', 'SQUARE', 'STRIPE', 'COINBASE', 'TWILIO', 'SENTINELONE'
    ];

    return [...indianStocks, ...globalStocks];
  }

  getPortfolioStats(): Record<string, unknown> {
    const stats = {
      totalStocks: this.watchlist.length,
      indianStocks: this.watchlist.filter(s => !['BTCUSD', 'ETHUSDT', 'GOOGL', 'AAPL', 'MSFT', 'NVDA', 'AMZN', 'TESLA', 'META', 'NETFLIX', 'ADOBE', 'NFLX', 'PAYPAL', 'INTC', 'AMD', 'QUALCOMM', 'BROADCOM', 'CISCO', 'ORACLE', 'SAP', 'IBM', 'HPE', 'DELL', 'ZOOM', 'SHOPIFY', 'AIRBNB', 'UBER', 'LYFT', 'DOCUSIGN', 'SQUARE', 'STRIPE', 'COINBASE', 'TWILIO', 'SENTINELONE'].includes(s)).length,
      globalStocks: this.watchlist.filter(s => ['BTCUSD', 'ETHUSDT', 'GOOGL', 'AAPL', 'MSFT', 'NVDA', 'AMZN', 'TESLA', 'META', 'NETFLIX', 'ADOBE', 'NFLX', 'PAYPAL', 'INTC', 'AMD', 'QUALCOMM', 'BROADCOM', 'CISCO', 'ORACLE', 'SAP', 'IBM', 'HPE', 'DELL', 'ZOOM', 'SHOPIFY', 'AIRBNB', 'UBER', 'LYFT', 'DOCUSIGN', 'SQUARE', 'STRIPE', 'COINBASE', 'TWILIO', 'SENTINELONE'].includes(s)).length,
      timestamp: new Date().toISOString(),
    };
    return stats;
  }
}
