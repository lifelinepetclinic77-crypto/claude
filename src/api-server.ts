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
