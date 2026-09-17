# Chrome TradingView Connector

A Node.js/TypeScript application that connects Chrome browser with TradingView for automated trading operations and chart monitoring.

## Features

- **Chrome Automation**: Uses Puppeteer to control Chrome browser
- **TradingView Integration**: Navigate and interact with TradingView charts
- **Alert Management**: Set price alerts on specific symbols
- **Screenshot Capture**: Take screenshots of charts
- **REST API**: Express-based API server for remote control
- **Real-time Status**: Health check and connection status endpoints

## Prerequisites

- Node.js 16+ and npm
- Chrome/Chromium browser
- TradingView account (optional, for authenticated features)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Usage

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Get Chart Data
```bash
POST /chart/:symbol
# Example: POST /chart/BTCUSD
```

### Set Price Alert
```bash
POST /alert
Content-Type: application/json

{
  "symbol": "BTCUSD",
  "price": 45000,
  "condition": "above" // or "below"
}
```

### Take Screenshot
```bash
POST /screenshot
Content-Type: application/json

{
  "filename": "chart-snapshot.png"
}
```

### Status Check
```bash
GET /status
```

## Architecture

### ChromeTradingViewConnector
Core class that manages:
- Browser instance initialization
- Page navigation
- Chart data extraction
- Alert configuration
- Screenshot capture

### ApiServer
Express server providing:
- RESTful endpoints
- Request validation
- Error handling
- JSON responses

## Development

### TypeScript Compilation
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.ts          # Entry point
│   ├── connector.ts      # TradingView connector class
│   └── api-server.ts     # REST API server
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Chrome Not Found
Ensure Chrome/Chromium is installed. On Linux:
```bash
apt-get install chromium-browser
```

### Connection Issues
- Check internet connectivity
- Verify TradingView is accessible
- Check port 3000 is available

### Memory Issues
Adjust Puppeteer launch options in `connector.ts`

## License

MIT

## Contributing

Submit issues and pull requests to improve this integration.
