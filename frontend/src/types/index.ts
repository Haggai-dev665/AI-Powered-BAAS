export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  ai_models: string[];
  config: Record<string, any>;
}

export interface AIModel {
  id: string;
  name: string;
  type: string;
  provider: string;
  capabilities: string[];
  status?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  model_used?: string;
  processing_time_ms?: number;
}

export interface HealthStatus {
  status: string;
  services: Record<string, string>;
  models_available?: string[];
  timestamp: string;
  version?: string;
}

export interface AIRequest {
  type: 'sentiment' | 'generate' | 'summarize' | 'translate';
  payload: any;
  requestId?: string;
}

export interface AIResult {
  requestId: string;
  type: string;
  result: APIResponse<any>;
  timestamp: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}