import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ServerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Analytics: React.FC = () => {
  const stats = [
    {
      name: 'Total API Calls',
      value: '2,847,392',
      change: '+12%',
      changeType: 'positive',
      icon: GlobeAltIcon
    },
    {
      name: 'Active Users',
      value: '14,827',
      change: '+8%',
      changeType: 'positive',
      icon: UserGroupIcon
    },
    {
      name: 'Response Time',
      value: '145ms',
      change: '-5%',
      changeType: 'positive',
      icon: ClockIcon
    },
    {
      name: 'Error Rate',
      value: '0.03%',
      change: '-12%',
      changeType: 'positive',
      icon: ExclamationTriangleIcon
    }
  ];

  const chartData = [
    { time: '00:00', requests: 120 },
    { time: '04:00', requests: 89 },
    { time: '08:00', requests: 245 },
    { time: '12:00', requests: 432 },
    { time: '16:00', requests: 389 },
    { time: '20:00', requests: 312 },
    { time: '24:00', requests: 156 }
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
        <div className="flex items-center space-x-3 mb-2">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <p className="text-gray-600">Monitor your AI-powered backend performance and usage</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <ArrowTrendingUpIcon className={`h-4 w-4 ${
                      stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Requests Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">API Requests (24h)</h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          {/* Simple chart representation */}
          <div className="space-y-3">
            {chartData.map((point, index) => (
              <div key={point.time} className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 w-12">{point.time}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(point.requests / 500) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-700 w-16 text-right">{point.requests}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Performance</h3>
          
          <div className="space-y-6">
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-medium text-gray-900">68%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium text-gray-900">42%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '42%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              </div>
            </div>

            {/* Storage Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage Usage</span>
                <span className="text-sm font-medium text-gray-900">34%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '34%' }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {[
            { action: 'New API key generated', time: '2 minutes ago', type: 'success' },
            { action: 'Database backup completed', time: '15 minutes ago', type: 'info' },
            { action: 'AI model training started', time: '1 hour ago', type: 'warning' },
            { action: 'User authentication successful', time: '2 hours ago', type: 'success' },
            { action: 'System health check passed', time: '3 hours ago', type: 'success' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`h-2 w-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;