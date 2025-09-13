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

export default api;