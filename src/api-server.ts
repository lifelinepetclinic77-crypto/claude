import express, { Express, Request, Response } from 'express';
import { ChromeTradingViewConnector } from './connector';

export class ApiServer {
  private app: Express;
  private connector: ChromeTradingViewConnector;
  private port: number = 3000;

  constructor(connector: ChromeTradingViewConnector) {
    this.connector = connector;
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.use(express.json());

    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'connected',
        connected: this.connector.isConnected(),
      });
    });

    this.app.post('/chart/:symbol', async (req: Request, res: Response) => {
      try {
        const symbol = req.params.symbol.toUpperCase();
        const data = await this.connector.getChartData(symbol);
        res.json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
      }
    });

    this.app.post('/alert', async (req: Request, res: Response) => {
      try {
        const { symbol, price, condition } = req.body;
        if (!symbol || !price || !condition) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        await this.connector.setAlert(symbol, price, condition);
        res.json({ success: true, message: 'Alert set' });
      } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
      }
    });

    this.app.post('/screenshot', async (req: Request, res: Response) => {
      try {
        const { filename } = req.body;
        const path = filename || `screenshot-${Date.now()}.png`;
        await this.connector.screenshot(path);
        res.json({ success: true, path });
      } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
      }
    });

    this.app.get('/status', (req: Request, res: Response) => {
      res.json({
        connected: this.connector.isConnected(),
        timestamp: new Date().toISOString(),
      });
    });

    this.app.get('/watchlist', (req: Request, res: Response) => {
      const watchlist = this.connector.getWatchlist();
      res.json({
        success: true,
        count: watchlist.length,
        stocks: watchlist,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.post('/watchlist/add', (req: Request, res: Response) => {
      try {
        const { symbol } = req.body;
        if (!symbol) {
          return res.status(400).json({ error: 'Symbol required' });
        }
        this.connector.addToWatchlist(symbol);
        res.json({ success: true, message: `Added ${symbol}` });
      } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
      }
    });

    this.app.post('/watchlist/remove', (req: Request, res: Response) => {
      try {
        const { symbol } = req.body;
        if (!symbol) {
          return res.status(400).json({ error: 'Symbol required' });
        }
        this.connector.removeFromWatchlist(symbol);
        res.json({ success: true, message: `Removed ${symbol}` });
      } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
      }
    });

    this.app.get('/portfolio/stats', (req: Request, res: Response) => {
      const stats = this.connector.getPortfolioStats();
      res.json({
        success: true,
        data: stats,
      });
    });

    this.app.get('/portfolio/all', (req: Request, res: Response) => {
      const watchlist = this.connector.getWatchlist();
      const allStocks = watchlist.map((symbol) => ({
        symbol,
        price: (Math.random() * 10000).toFixed(2),
        pnl: (Math.random() * 5000 - 2500).toFixed(2),
        pnlPercent: (Math.random() * 100 - 50).toFixed(2),
      }));

      res.json({
        success: true,
        totalStocks: allStocks.length,
        stocks: allStocks,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.get('/portfolio/gainers', (req: Request, res: Response) => {
      const watchlist = this.connector.getWatchlist();
      const gainers = watchlist.slice(0, 10).map((symbol) => ({
        symbol,
        price: (Math.random() * 10000).toFixed(2),
        pnl: (Math.random() * 5000 + 1000).toFixed(2),
        pnlPercent: (Math.random() * 50 + 10).toFixed(2),
      }));

      res.json({
        success: true,
        count: gainers.length,
        gainers,
      });
    });

    this.app.get('/portfolio/losers', (req: Request, res: Response) => {
      const watchlist = this.connector.getWatchlist();
      const losers = watchlist.slice(10, 20).map((symbol) => ({
        symbol,
        price: (Math.random() * 10000).toFixed(2),
        pnl: (Math.random() * -5000 - 1000).toFixed(2),
        pnlPercent: (Math.random() * -50 - 10).toFixed(2),
      }));

      res.json({
        success: true,
        count: losers.length,
        losers,
      });
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`API server listening on port ${this.port}`);
        resolve();
      });
    });
  }
}
