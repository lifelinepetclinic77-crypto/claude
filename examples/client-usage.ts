import { TradingViewClient } from '../src/client';

async function main() {
  const client = new TradingViewClient({
    baseURL: 'http://localhost:3000',
  });

  try {
    const health = await client.getHealth();
    console.log('Health:', health);

    if (await client.isConnected()) {
      console.log('✓ Connected to TradingView server');

      const chartData = await client.getChartData('ETHUSDT');
      console.log('Chart data:', chartData);

      const alert = await client.setAlert('ETHUSDT', 2500, 'above');
      console.log('Alert response:', alert);

      const screenshot = await client.takeScreenshot('eth-chart.png');
      console.log('Screenshot:', screenshot);
    }
  } catch (error) {
    console.error('Client error:', error);
  }
}

main();
