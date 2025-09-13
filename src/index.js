import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration
const PORT = process.env.PORT || 3001;
const RUST_CORE_URL = process.env.RUST_CORE_URL || 'http://localhost:8080';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const services = {
      nodejs: 'healthy',
      rust_core: 'unknown',
      ai_services: 'unknown'
    };

    // Check Rust core service
    try {
      const rustResponse = await axios.get(`${RUST_CORE_URL}/health`, { timeout: 5000 });
      services.rust_core = rustResponse.status === 200 ? 'healthy' : 'unhealthy';
    } catch (error) {
      services.rust_core = 'unavailable';
    }

    // Check AI services
    try {
      const aiResponse = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 });
      services.ai_services = aiResponse.status === 200 ? 'healthy' : 'unhealthy';
    } catch (error) {
      services.ai_services = 'unavailable';
    }

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services,
        version: process.env.npm_package_version || '1.0.0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'AI-Powered BaaS - Node.js API Gateway',
      version: '1.0.0',
      documentation: '/api/docs',
      endpoints: {
        health: '/health',
        projects: '/api/v1/projects',
        ai: '/api/v1/ai',
        realtime: 'WebSocket on same port'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Projects API (proxy to Rust core)
app.get('/api/v1/projects', async (req, res) => {
  try {
    const response = await axios.get(`${RUST_CORE_URL}/api/v1/projects`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/projects', async (req, res) => {
  try {
    const response = await axios.post(`${RUST_CORE_URL}/api/v1/projects`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/v1/projects/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RUST_CORE_URL}/api/v1/projects/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      timestamp: new Date().toISOString()
    });
  }
});

// AI API (proxy to Python AI services)
app.post('/api/v1/ai/generate', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/text/generate`, req.body);
    
    // Emit real-time update
    io.emit('ai_generation_complete', {
      type: 'text_generation',
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in text generation:', error.message);
    res.status(500).json({
      success: false,
      error: 'Text generation failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/ai/sentiment', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/sentiment`, req.body);
    
    // Emit real-time update
    io.emit('ai_analysis_complete', {
      type: 'sentiment_analysis',
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in sentiment analysis:', error.message);
    res.status(500).json({
      success: false,
      error: 'Sentiment analysis failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/ai/summarize', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/summarize`, req.body);
    
    // Emit real-time update
    io.emit('ai_analysis_complete', {
      type: 'text_summarization',
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in text summarization:', error.message);
    res.status(500).json({
      success: false,
      error: 'Text summarization failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/ai/translate', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/translate`, req.body);
    
    // Emit real-time update
    io.emit('ai_analysis_complete', {
      type: 'translation',
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in translation:', error.message);
    res.status(500).json({
      success: false,
      error: 'Translation failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/v1/ai/models', async (req, res) => {
  try {
    const [rustModels, aiModels] = await Promise.all([
      axios.get(`${RUST_CORE_URL}/api/v1/ai/models`).catch(() => ({ data: { data: [] } })),
      axios.get(`${AI_SERVICE_URL}/ai/models`).catch(() => ({ data: { data: { models: [] } } }))
    ]);

    const allModels = [
      ...(rustModels.data.data || []),
      ...(aiModels.data.data?.models || [])
    ];

    res.json({
      success: true,
      data: {
        models: allModels,
        total: allModels.length,
        sources: ['rust-core', 'ai-services']
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching models:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI models',
      timestamp: new Date().toISOString()
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('connected', {
    message: 'Connected to AI-Powered BaaS real-time service',
    timestamp: new Date().toISOString(),
    clientId: socket.id
  });

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Client ${socket.id} joined project ${projectId}`);
  });

  socket.on('ai_request', async (data) => {
    try {
      console.log('Real-time AI request:', data);
      
      // Emit processing status
      socket.emit('ai_processing', {
        requestId: data.requestId || 'unknown',
        status: 'processing',
        timestamp: new Date().toISOString()
      });

      // Process the AI request based on type
      let result;
      switch (data.type) {
        case 'sentiment':
          result = await axios.post(`${AI_SERVICE_URL}/ai/sentiment`, data.payload);
          break;
        case 'generate':
          result = await axios.post(`${AI_SERVICE_URL}/ai/text/generate`, data.payload);
          break;
        case 'summarize':
          result = await axios.post(`${AI_SERVICE_URL}/ai/summarize`, data.payload);
          break;
        default:
          throw new Error(`Unknown AI request type: ${data.type}`);
      }

      // Emit the result
      socket.emit('ai_result', {
        requestId: data.requestId || 'unknown',
        type: data.type,
        result: result.data,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Real-time AI request error:', error.message);
      socket.emit('ai_error', {
        requestId: data.requestId || 'unknown',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Database Management APIs
app.get('/api/v1/databases', (req, res) => {
  const databases = [
    {
      id: 'db_001',
      name: 'user_data_postgres',
      type: 'postgresql',
      status: 'running',
      size: '2.3 GB',
      connections: 45,
      maxConnections: 100,
      host: 'db-cluster-01.internal',
      port: 5432,
      version: '15.4',
      created: '2024-01-15T10:30:00Z',
      lastBackup: '2024-01-20T03:00:00Z'
    },
    {
      id: 'db_002', 
      name: 'analytics_mongodb',
      type: 'mongodb',
      status: 'running',
      size: '847 MB',
      connections: 23,
      maxConnections: 200,
      host: 'mongodb-cluster.internal',
      port: 27017,
      version: '7.0.1',
      created: '2024-01-10T14:20:00Z',
      lastBackup: '2024-01-20T03:30:00Z'
    },
    {
      id: 'db_003',
      name: 'cache_redis',
      type: 'redis',
      status: 'running',
      size: '156 MB',
      connections: 78,
      maxConnections: 1000,
      host: 'redis-cluster.internal',
      port: 6379,
      version: '7.2.3',
      created: '2024-01-12T09:15:00Z',
      lastBackup: 'N/A'
    }
  ];

  res.json({
    success: true,
    data: {
      databases,
      totalDatabases: databases.length,
      totalConnections: databases.reduce((sum, db) => sum + db.connections, 0),
      totalSize: '3.3 GB'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/databases/backups', (req, res) => {
  const backups = [
    {
      id: 'backup_001',
      databaseId: 'db_001',
      databaseName: 'user_data_postgres',
      type: 'full',
      status: 'completed',
      size: '2.1 GB',
      created: '2024-01-20T03:00:00Z',
      duration: '12m 34s',
      retentionDays: 30
    },
    {
      id: 'backup_002',
      databaseId: 'db_002',
      databaseName: 'analytics_mongodb',
      type: 'incremental',
      status: 'completed',
      size: '145 MB',
      created: '2024-01-20T03:30:00Z',
      duration: '3m 42s',
      retentionDays: 30
    },
    {
      id: 'backup_003',
      databaseId: 'db_001',
      databaseName: 'user_data_postgres',
      type: 'incremental',
      status: 'in_progress',
      size: '456 MB',
      created: '2024-01-20T15:00:00Z',
      duration: '2m 15s',
      retentionDays: 7
    }
  ];

  res.json({
    success: true,
    data: { backups, totalBackups: backups.length },
    timestamp: new Date().toISOString()
  });
});

// Storage Management APIs
app.get('/api/v1/storage', (req, res) => {
  const storageStats = {
    totalStorage: '150 GB',
    usedStorage: '89.5 GB',
    availableStorage: '60.5 GB',
    usage: 59.7,
    files: {
      total: 15847,
      images: 8923,
      videos: 234,
      documents: 3456,
      other: 3234
    },
    cdn: {
      enabled: true,
      requests: 1234567,
      bandwidth: '45.2 GB',
      cacheHitRate: 94.5
    }
  };

  res.json({
    success: true,
    data: storageStats,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/storage/files', (req, res) => {
  const files = [
    {
      id: 'file_001',
      name: 'user-avatar-123.jpg',
      type: 'image',
      size: '245 KB',
      uploaded: '2024-01-20T14:30:00Z',
      downloads: 45,
      url: 'https://cdn.aibaas.com/images/user-avatar-123.jpg'
    },
    {
      id: 'file_002',
      name: 'product-demo.mp4',
      type: 'video',
      size: '12.5 MB',
      uploaded: '2024-01-19T10:15:00Z',
      downloads: 156,
      url: 'https://cdn.aibaas.com/videos/product-demo.mp4'
    },
    {
      id: 'file_003',
      name: 'annual-report-2024.pdf',
      type: 'document',
      size: '2.1 MB',
      uploaded: '2024-01-18T16:45:00Z',
      downloads: 234,
      url: 'https://cdn.aibaas.com/docs/annual-report-2024.pdf'
    }
  ];

  res.json({
    success: true,
    data: { files, totalFiles: files.length },
    timestamp: new Date().toISOString()
  });
});

// User Management APIs
app.get('/api/v1/users', (req, res) => {
  const users = [
    {
      id: 'user_001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20T14:30:00Z',
      created: '2024-01-01T10:00:00Z',
      projects: 5,
      avatar: 'https://avatars.example.com/john.jpg'
    },
    {
      id: 'user_002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'developer',
      status: 'active',
      lastLogin: '2024-01-20T09:15:00Z',
      created: '2024-01-05T14:30:00Z',
      projects: 3,
      avatar: 'https://avatars.example.com/jane.jpg'
    },
    {
      id: 'user_003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-18T16:45:00Z',
      created: '2024-01-10T11:20:00Z',
      projects: 1,
      avatar: 'https://avatars.example.com/bob.jpg'
    }
  ];

  res.json({
    success: true,
    data: { users, totalUsers: users.length },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/users/roles', (req, res) => {
  const roles = [
    {
      id: 'role_001',
      name: 'admin',
      description: 'Full system access and management capabilities',
      userCount: 2,
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_billing']
    },
    {
      id: 'role_002',
      name: 'developer',
      description: 'Development and deployment access',
      userCount: 15,
      permissions: ['read', 'write', 'deploy', 'manage_projects']
    },
    {
      id: 'role_003',
      name: 'viewer',
      description: 'Read-only access to resources',
      userCount: 8,
      permissions: ['read']
    }
  ];

  res.json({
    success: true,
    data: { roles, totalRoles: roles.length },
    timestamp: new Date().toISOString()
  });
});

// Monitoring APIs
app.get('/api/v1/monitoring/health', (req, res) => {
  const healthMetrics = {
    system: {
      cpu: 45.2,
      memory: 67.8,
      disk: 34.5,
      network: 12.3
    },
    services: {
      api: { status: 'healthy', uptime: '99.98%', responseTime: '145ms' },
      database: { status: 'healthy', uptime: '99.95%', responseTime: '23ms' },
      cache: { status: 'healthy', uptime: '99.99%', responseTime: '5ms' },
      storage: { status: 'healthy', uptime: '99.97%', responseTime: '78ms' }
    },
    alerts: {
      critical: 0,
      warning: 2,
      info: 5
    }
  };

  res.json({
    success: true,
    data: healthMetrics,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/monitoring/logs', (req, res) => {
  const logs = [
    {
      id: 'log_001',
      timestamp: '2024-01-20T15:30:45Z',
      level: 'error',
      service: 'api',
      message: 'Database connection timeout after 30 seconds',
      details: { query: 'SELECT * FROM users', duration: '30.5s' }
    },
    {
      id: 'log_002',
      timestamp: '2024-01-20T15:30:30Z',
      level: 'warning',
      service: 'storage',
      message: 'Storage usage exceeding 80% threshold',
      details: { usage: '89.5GB', total: '150GB' }
    },
    {
      id: 'log_003',
      timestamp: '2024-01-20T15:30:15Z',
      level: 'info',
      service: 'ai',
      message: 'Model inference completed successfully',
      details: { model: 'text-generation-v2', tokens: 1000 }
    }
  ];

  res.json({
    success: true,
    data: { logs, totalLogs: logs.length },
    timestamp: new Date().toISOString()
  });
});

// Communication APIs
app.get('/api/v1/communication/stats', (req, res) => {
  const stats = {
    email: {
      sent: 15847,
      delivered: 15234,
      opened: 12456,
      clicked: 3456,
      bounced: 123
    },
    sms: {
      sent: 5234,
      delivered: 5198,
      failed: 36
    },
    push: {
      sent: 98765,
      delivered: 97543,
      opened: 45678,
      failed: 1222
    },
    chat: {
      activeChannels: 234,
      messagesDaily: 15678,
      averageResponse: '2m 34s'
    }
  };

  res.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString()
  });
});

// Billing APIs
app.get('/api/v1/billing/usage', (req, res) => {
  const usage = {
    currentPeriod: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-01-31T23:59:59Z',
      apiCalls: 1234567,
      storage: '89.5 GB',
      bandwidth: '456 GB',
      aiInference: 45678
    },
    costs: {
      apiCalls: 123.45,
      storage: 89.50,
      bandwidth: 45.60,
      aiInference: 234.78,
      total: 493.33
    },
    limits: {
      apiCalls: 10000000,
      storage: '1 TB',
      bandwidth: '10 TB',
      aiInference: 1000000
    }
  };

  res.json({
    success: true,
    data: usage,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/billing/invoices', (req, res) => {
  const invoices = [
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      date: '2024-01-01T00:00:00Z',
      amount: 493.33,
      status: 'paid',
      dueDate: '2024-01-15T00:00:00Z',
      paidDate: '2024-01-10T14:30:00Z'
    },
    {
      id: 'inv_002',
      number: 'INV-2024-002',
      date: '2024-01-15T00:00:00Z',
      amount: 567.89,
      status: 'pending',
      dueDate: '2024-01-30T00:00:00Z',
      paidDate: null
    }
  ];

  res.json({
    success: true,
    data: { invoices, totalInvoices: invoices.length },
    timestamp: new Date().toISOString()
  });
});

// Settings APIs
app.get('/api/v1/settings', (req, res) => {
  const settings = {
    general: {
      organizationName: 'AI BaaS Platform',
      timezone: 'UTC',
      language: 'en',
      theme: 'light'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 3600,
      passwordPolicy: 'strong',
      ipWhitelisting: false
    },
    integrations: {
      github: { enabled: true, connected: true },
      slack: { enabled: true, connected: false },
      discord: { enabled: false, connected: false },
      webhook: { enabled: true, url: 'https://api.example.com/webhooks' }
    }
  };

  res.json({
    success: true,
    data: settings,
    timestamp: new Date().toISOString()
  });
});

// Extended AI APIs
app.get('/api/v1/ai/training/jobs', (req, res) => {
  const jobs = [
    {
      id: 'job_001',
      name: 'sentiment-model-v2',
      status: 'completed',
      progress: 100,
      accuracy: 94.5,
      startTime: '2024-01-19T10:00:00Z',
      endTime: '2024-01-19T14:30:00Z',
      dataset: 'customer-reviews-2024'
    },
    {
      id: 'job_002',
      name: 'text-classification-v3',
      status: 'running',
      progress: 65,
      accuracy: null,
      startTime: '2024-01-20T09:00:00Z',
      endTime: null,
      dataset: 'support-tickets-2024'
    }
  ];

  res.json({
    success: true,
    data: { jobs, totalJobs: jobs.length },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/analytics/realtime', (req, res) => {
  const realtimeData = {
    activeUsers: 234,
    requestsPerSecond: 45.6,
    averageResponseTime: 156,
    errorRate: 0.02,
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    activeConnections: 189
  };

  res.json({
    success: true,
    data: realtimeData,
    timestamp: new Date().toISOString()
  });
});

// API Keys Management
app.get('/api/v1/api/keys', (req, res) => {
  const apiKeys = [
    {
      id: 'key_001',
      name: 'Production API Key',
      key: 'ak_prod_*********************1234',
      created: '2024-01-01T10:00:00Z',
      lastUsed: '2024-01-20T14:30:00Z',
      requests: 1234567,
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: 'key_002',
      name: 'Development API Key',
      key: 'ak_dev_**********************5678',
      created: '2024-01-10T15:20:00Z',
      lastUsed: '2024-01-20T12:15:00Z',
      requests: 45678,
      status: 'active',
      permissions: ['read']
    }
  ];

  res.json({
    success: true,
    data: { apiKeys, totalKeys: apiKeys.length },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/v1/projects',
      'POST /api/v1/projects',
      'GET /api/v1/projects/:id',
      'POST /api/v1/ai/generate',
      'POST /api/v1/ai/sentiment',
      'POST /api/v1/ai/summarize',
      'POST /api/v1/ai/translate',
      'GET /api/v1/ai/models',
      'GET /api/v1/ai/training/jobs',
      'GET /api/v1/databases',
      'GET /api/v1/databases/backups',
      'GET /api/v1/storage',
      'GET /api/v1/storage/files',
      'GET /api/v1/users',
      'GET /api/v1/users/roles',
      'GET /api/v1/monitoring/health',
      'GET /api/v1/monitoring/logs',
      'GET /api/v1/communication/stats',
      'GET /api/v1/billing/usage',
      'GET /api/v1/billing/invoices',
      'GET /api/v1/settings',
      'GET /api/v1/analytics/realtime',
      'GET /api/v1/api/keys'
    ]
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Node.js API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket enabled for real-time features`);
  console.log(`🔗 Rust Core URL: ${RUST_CORE_URL}`);
  console.log(`🤖 AI Services URL: ${AI_SERVICE_URL}`);
});

export default app;