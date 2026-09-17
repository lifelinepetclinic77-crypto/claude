export interface AlertConfig {
  symbol: string;
  price: number;
  condition: 'above' | 'below';
  timestamp?: Date;
}

export interface ChartDataResponse {
  title: string;
  url: string;
  timestamp: string;
  symbol?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthStatus {
  status: string;
  connected: boolean;
}

export interface ConnectorStatus {
  connected: boolean;
  timestamp: string;
}
