import axios from 'axios';
import { APIResponse, Project, AIModel, HealthStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const getHealth = async (): Promise<APIResponse<HealthStatus>> => {
  const response = await api.get('/health');
  return response.data;
};

// Projects
export const getProjects = async (): Promise<APIResponse<Project[]>> => {
  const response = await api.get('/api/v1/projects');
  return response.data;
};

export const createProject = async (projectData: Partial<Project>): Promise<APIResponse<Project>> => {
  const response = await api.post('/api/v1/projects', projectData);
  return response.data;
};

export const getProject = async (id: string): Promise<APIResponse<Project>> => {
  const response = await api.get(`/api/v1/projects/${id}`);
  return response.data;
};

// AI Models
export const getAIModels = async (): Promise<APIResponse<{ models: AIModel[] }>> => {
  const response = await api.get('/api/v1/ai/models');
  return response.data;
};

// AI Services
export const generateText = async (prompt: string, options?: any): Promise<APIResponse<any>> => {
  const response = await api.post('/api/v1/ai/generate', {
    prompt,
    max_tokens: options?.maxTokens || 1000,
    temperature: options?.temperature || 0.7,
    ...options
  });
  return response.data;
};

export const analyzeSentiment = async (text: string): Promise<APIResponse<any>> => {
  const response = await api.post('/api/v1/ai/sentiment', { text });
  return response.data;
};

export const summarizeText = async (text: string, maxLength?: number): Promise<APIResponse<any>> => {
  const response = await api.post('/api/v1/ai/summarize', {
    text,
    max_length: maxLength || 200
  });
  return response.data;
};

export const translateText = async (text: string, targetLanguage: string, sourceLanguage?: string): Promise<APIResponse<any>> => {
  const response = await api.post('/api/v1/ai/translate', {
    text,
    target_language: targetLanguage,
    source_language: sourceLanguage || 'auto'
  });
  return response.data;
};

// Database Management
export const getDatabases = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/databases');
  return response.data;
};

export const getDatabaseBackups = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/databases/backups');
  return response.data;
};

// Storage Management
export const getStorageStats = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/storage');
  return response.data;
};

export const getStorageFiles = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/storage/files');
  return response.data;
};

// User Management
export const getUsers = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/users');
  return response.data;
};

export const getUserRoles = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/users/roles');
  return response.data;
};

// Monitoring
export const getMonitoringHealth = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/monitoring/health');
  return response.data;
};

export const getMonitoringLogs = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/monitoring/logs');
  return response.data;
};

// Communication
export const getCommunicationStats = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/communication/stats');
  return response.data;
};

// Billing
export const getBillingUsage = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/billing/usage');
  return response.data;
};

export const getBillingInvoices = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/billing/invoices');
  return response.data;
};

// Settings
export const getSettings = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/settings');
  return response.data;
};

// AI Training
export const getAITrainingJobs = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/ai/training/jobs');
  return response.data;
};

// Real-time Analytics
export const getRealtimeAnalytics = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/analytics/realtime');
  return response.data;
};

// API Keys Management
export const getAPIKeys = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/v1/api/keys');
  return response.data;
};

export default api;