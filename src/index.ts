import { ChromeTradingViewConnector } from './connector';
import { ApiServer } from './api-server';

async function main() {
  const connector = new ChromeTradingViewConnector();
  const apiServer = new ApiServer(connector);

  try {
    await connector.initialize();
    console.log('Chrome browser initialized');

    await apiServer.start();
    console.log('API server started on port 3000');

    console.log('Chrome TradingView Connector is ready');
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

main();
