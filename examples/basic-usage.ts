import { ChromeTradingViewConnector } from '../src/connector';

async function main() {
  const connector = new ChromeTradingViewConnector({
    headless: false,
    timeout: 30000,
  });

  try {
    await connector.initialize();
    console.log('✓ Chrome initialized and connected to TradingView');

    const chartData = await connector.getChartData('BTCUSD');
    console.log('✓ Retrieved chart data:', chartData);

    await connector.setAlert('BTCUSD', 45000, 'above');
    console.log('✓ Alert set for BTCUSD above $45,000');

    await connector.screenshot('btc-chart.png');
    console.log('✓ Screenshot saved');

    await connector.close();
    console.log('✓ Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
