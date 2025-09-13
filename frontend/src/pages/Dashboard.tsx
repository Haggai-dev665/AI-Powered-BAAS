import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  CloudIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getHealth, getAIModels } from '../utils/api';
import { HealthStatus, AIModel } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';

const Dashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { connected, messages } = useWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, modelsRes] = await Promise.all([
          getHealth(),
          getAIModels()
        ]);

        if (healthRes.success && healthRes.data) {
          setHealthStatus(healthRes.data);
        }

        if (modelsRes.success && modelsRes.data) {
          setAIModels(modelsRes.data.models);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: CpuChipIcon,
      title: 'Rust Core Backend',
      description: 'High-performance core services built with Rust for maximum speed and reliability.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: LightBulbIcon,
      title: 'Gemini AI Integration',
      description: 'Native integration with Google\'s Gemini API for advanced NLP capabilities.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: CloudIcon,
      title: 'Real-time Processing',
      description: 'WebSocket-powered real-time AI processing and notifications.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Custom Model Training',
      description: 'Train and deploy custom AI models using Jupyter notebooks.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-gradient mb-6">
          AI-Powered Backend as a Service
        </h1>
        <p className="text-xl text-primary-600 mb-8 max-w-3xl mx-auto">
          The first truly AI-native BaaS platform built with Rust, React TypeScript, Node.js, and Python.
          Featuring native Gemini API integration and custom model training capabilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button 
            className="btn-primary inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RocketLaunchIcon className="h-5 w-5" />
            <span>Get Started</span>
          </motion.button>
          <motion.button 
            className="btn-secondary inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>View Documentation</span>
          </motion.button>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* WebSocket Status */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-900">WebSocket</h3>
                <p className="text-primary-600">{connected ? 'Connected' : 'Disconnected'}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          </div>

          {/* Services Status */}
          {healthStatus?.services && Object.entries(healthStatus.services).map(([service, status]) => (
            <div key={service} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary-900 capitalize">{service.replace('_', ' ')}</h3>
                  <p className="text-primary-600 capitalize">{status}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${
                  status === 'healthy' ? 'bg-green-500' : 
                  status === 'unavailable' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.title}
                className="card group hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">{feature.title}</h3>
                    <p className="text-primary-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Models */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Available AI Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModels.map((model, index) => (
            <motion.div 
              key={model.id}
              className="card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-900">{model.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  model.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {model.status || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-primary-600 mb-3">{model.provider}</p>
              <div className="flex flex-wrap gap-1">
                {model.capabilities.map((capability) => (
                  <span 
                    key={capability} 
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {messages.length > 0 && (
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Recent Activity</h2>
          <div className="card max-h-96 overflow-y-auto">
            {messages.slice(-5).map((message, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 border-b border-primary-200 last:border-b-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-primary-900">{message.type}</p>
                  <p className="text-xs text-primary-600">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;