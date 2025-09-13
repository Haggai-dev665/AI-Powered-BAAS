import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  EyeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { getMonitoringHealth, getMonitoringLogs } from '../utils/api';

const MonitoringMain: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await getMonitoringHealth();
        if (response.success) {
          setHealthData(response.data);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitor system health, performance, and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      {healthData?.system && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <CpuChipIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">CPU Usage</p>
                <p className="text-2xl font-bold">{healthData.system.cpu}%</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthData.system.cpu}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <ServerIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Memory Usage</p>
                <p className="text-2xl font-bold">{healthData.system.memory}%</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthData.system.memory}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <CircleStackIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Disk Usage</p>
                <p className="text-2xl font-bold">{healthData.system.disk}%</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthData.system.disk}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <CloudIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Network I/O</p>
                <p className="text-2xl font-bold">{healthData.system.network}%</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${healthData.system.network}%` }}
              ></div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Service Status */}
      {healthData?.services && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(healthData.services).map(([serviceName, service]: [string, any], index) => (
                <motion.div
                  key={serviceName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      <h3 className="ml-2 text-lg font-medium text-gray-900 capitalize">
                        {serviceName.replace('_', ' ')}
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {service.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium text-gray-900">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium text-gray-900">{service.responseTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Summary */}
      {healthData?.alerts && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Alerts Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{healthData.alerts.critical}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{healthData.alerts.warning}</p>
                <p className="text-sm text-gray-600">Warning</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{healthData.alerts.info}</p>
                <p className="text-sm text-gray-600">Info</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/monitoring/health"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <p className="text-sm text-gray-600">Detailed health metrics</p>
            </div>
          </div>
        </Link>

        <Link
          to="/monitoring/logs"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
              <p className="text-sm text-gray-600">View system logs</p>
            </div>
          </div>
        </Link>

        <Link
          to="/monitoring/alerts"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500"
        >
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Alert Management</h3>
              <p className="text-sm text-gray-600">Configure alerts</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const SystemHealth: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await getMonitoringHealth();
        if (response.success) {
          setHealthData(response.data);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ArrowPathIcon className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-2">Detailed system performance and health metrics</p>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Real-time Performance</h2>
          <div className="flex items-center text-green-600">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">Live Data</span>
          </div>
        </div>

        {healthData?.system && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - healthData.system.cpu / 100)}`}
                    className="text-blue-600"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-900">
                  {healthData.system.cpu}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">CPU Usage</p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - healthData.system.memory / 100)}`}
                    className="text-green-600"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-900">
                  {healthData.system.memory}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">Memory Usage</p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - healthData.system.disk / 100)}`}
                    className="text-purple-600"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-900">
                  {healthData.system.disk}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">Disk Usage</p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    transform="translate(36,36)"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - healthData.system.network / 100)}`}
                    className="text-orange-600"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-900">
                  {healthData.system.network}%
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">Network I/O</p>
            </div>
          </div>
        )}
      </div>

      {/* Service Health Details */}
      {healthData?.services && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Service Health Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(healthData.services).map(([serviceName, service]: [string, any], index) => (
                  <motion.tr
                    key={serviceName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ServerIcon className="h-6 w-6 text-blue-600" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {serviceName.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="ml-2 text-sm text-gray-900 capitalize">{service.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.uptime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.responseTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Restart
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Configure
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getMonitoringLogs();
        if (response.success) {
          setLogs(response.data.logs);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-2">View and analyze system log entries</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by level:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Log Entries ({filteredLogs.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getLevelIcon(log.level)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(log.level)} capitalize`}>
                        {log.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">{log.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: 'High CPU Usage',
      condition: 'CPU > 80%',
      enabled: true,
      severity: 'warning',
      lastTriggered: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      name: 'Memory Critical',
      condition: 'Memory > 95%',
      enabled: true,
      severity: 'critical',
      lastTriggered: null
    },
    {
      id: 3,
      name: 'Disk Space Low',
      condition: 'Disk > 90%',
      enabled: false,
      severity: 'warning',
      lastTriggered: '2024-01-19T08:15:00Z'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600 mt-2">Configure and manage system alerts</p>
        </div>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          Create Alert
        </button>
      </div>

      {/* Alert Rules */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alert Rules</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <BellIcon className="h-6 w-6 text-yellow-600" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{alert.name}</h3>
                        <p className="text-sm text-gray-500">{alert.condition}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)} capitalize`}>
                      {alert.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Last triggered: {alert.lastTriggered 
                          ? new Date(alert.lastTriggered).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alert.enabled ? 'bg-yellow-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alert.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Send alerts via email</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Slack Integration</h3>
              <p className="text-sm text-gray-500">Send alerts to Slack channels</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">SMS Alerts</h3>
              <p className="text-sm text-gray-500">Send critical alerts via SMS</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Monitoring: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/monitoring"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/monitoring'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/monitoring/health"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/monitoring/health'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Health
          </Link>
          <Link
            to="/monitoring/logs"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/monitoring/logs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs
          </Link>
          <Link
            to="/monitoring/alerts"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/monitoring/alerts'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Alerts
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<MonitoringMain />} />
        <Route path="/health" element={<SystemHealth />} />
        <Route path="/logs" element={<SystemLogs />} />
        <Route path="/alerts" element={<AlertManagement />} />
      </Routes>
    </div>
  );
};

export default Monitoring;