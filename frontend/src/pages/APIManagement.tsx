import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  KeyIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  requests: number;
}

const APIManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('keys');
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const apiKeys: APIKey[] = [
    {
      id: '1',
      name: 'Production API',
      key: 'aib_prod_1234567890abcdef',
      permissions: ['read', 'write', 'admin'],
      createdAt: '2024-01-15',
      lastUsed: '2 hours ago',
      requests: 15420
    },
    {
      id: '2',
      name: 'Development API',
      key: 'aib_dev_abcdef1234567890',
      permissions: ['read', 'write'],
      createdAt: '2024-01-10',
      lastUsed: '1 day ago',
      requests: 2847
    },
    {
      id: '3',
      name: 'Mobile App API',
      key: 'aib_mobile_9876543210fedcba',
      permissions: ['read'],
      createdAt: '2024-01-08',
      lastUsed: '3 hours ago',
      requests: 8932
    }
  ];

  const endpoints = [
    { method: 'GET', path: '/api/v1/ai/models', description: 'List available AI models' },
    { method: 'POST', path: '/api/v1/ai/generate', description: 'Generate AI content' },
    { method: 'GET', path: '/api/v1/databases', description: 'List databases' },
    { method: 'POST', path: '/api/v1/databases', description: 'Create new database' },
    { method: 'GET', path: '/api/v1/storage/files', description: 'List files' },
    { method: 'POST', path: '/api/v1/storage/upload', description: 'Upload file' }
  ];

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabs = [
    { id: 'keys', name: 'API Keys', icon: KeyIcon },
    { id: 'endpoints', name: 'Endpoints', icon: CodeBracketIcon },
    { id: 'docs', name: 'Documentation', icon: DocumentTextIcon },
    { id: 'rate-limits', name: 'Rate Limits', icon: ClockIcon }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
            </div>
            <p className="text-gray-600">Manage your API keys, endpoints, and documentation</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Generate API Key</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-b border-gray-200"
      >
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <div className="min-h-96">
        {selectedTab === 'keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* API Keys List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your API Keys</h3>
                <p className="text-sm text-gray-600">Manage and monitor your API access keys</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {apiKeys.map((apiKey, index) => (
                  <motion.div
                    key={apiKey.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{apiKey.name}</h4>
                          <div className="flex space-x-1">
                            {apiKey.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span>Key:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                              {showKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {showKey === apiKey.id ? (
                                <EyeSlashIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {copiedKey === apiKey.id ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <ClipboardDocumentIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                          <span>Created: {apiKey.createdAt}</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                          <span>{apiKey.requests.toLocaleString()} requests</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'endpoints' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
                <p className="text-sm text-gray-600">Available API endpoints and their descriptions</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm text-gray-900 flex-1">
                        {endpoint.path}
                      </code>
                      <span className="text-sm text-gray-600">{endpoint.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'docs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
              <p className="text-gray-600 mb-6">Comprehensive guides and references for our API</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View Full Documentation
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedTab === 'rate-limits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="text-center py-12">
              <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Limiting</h3>
              <p className="text-gray-600 mb-6">Configure API rate limits and usage quotas</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Configure Limits
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default APIManagement;