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
      'GET /api/v1/ai/models'
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