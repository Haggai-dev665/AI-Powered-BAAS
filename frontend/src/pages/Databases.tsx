import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  CircleStackIcon,
  TableCellsIcon,
  ServerIcon,
  ArchiveBoxIcon,
  WrenchIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getDatabases, getDatabaseBackups } from '../utils/api';

const DatabasesMain: React.FC = () => {
  const [databases, setDatabases] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await getDatabases();
        if (response.success) {
          setDatabases(response.data.databases);
          setStats({
            totalDatabases: response.data.totalDatabases,
            totalConnections: response.data.totalConnections,
            totalSize: response.data.totalSize
          });
        }
      } catch (error) {
        console.error('Error fetching databases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'stopped':
        return <StopIcon className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'postgresql':
        return <TableCellsIcon className="h-8 w-8 text-blue-600" />;
      case 'mongodb':
        return <ServerIcon className="h-8 w-8 text-green-600" />;
      case 'redis':
        return <CircleStackIcon className="h-8 w-8 text-red-600" />;
      default:
        return <CircleStackIcon className="h-8 w-8 text-gray-600" />;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600 mt-2">Manage your SQL and NoSQL databases</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Database
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <CircleStackIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Databases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDatabases}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConnections}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <ArchiveBoxIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Databases List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Database Instances</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Database
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connections
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Backup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {databases.map((db, index) => (
                <motion.tr
                  key={db.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(db.type)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{db.name}</div>
                        <div className="text-sm text-gray-500">{db.host}:{db.port}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {db.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(db.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{db.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {db.connections}/{db.maxConnections}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {db.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {db.lastBackup === 'N/A' ? 'N/A' : new Date(db.lastBackup).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Manage
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      Backup
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Stop
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

const SQLDatabases: React.FC = () => {
  const [databases, setDatabases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await getDatabases();
        if (response.success) {
          // Filter only SQL databases
          const sqlDbs = response.data.databases.filter((db: any) => 
            ['postgresql', 'mysql', 'sqlite'].includes(db.type)
          );
          setDatabases(sqlDbs);
        }
      } catch (error) {
        console.error('Error fetching SQL databases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SQL Databases</h1>
        <p className="text-gray-600 mt-2">Manage your relational databases</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SQL Database Instances</h2>
        {databases.length === 0 ? (
          <div className="text-center py-8">
            <TableCellsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No SQL databases found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {databases.map((db, index) => (
              <motion.div
                key={db.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TableCellsIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{db.name}</h3>
                      <p className="text-sm text-gray-500">PostgreSQL {db.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{db.connections} connections</p>
                      <p className="text-sm text-gray-500">{db.size}</p>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NoSQLDatabases: React.FC = () => {
  const [databases, setDatabases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await getDatabases();
        if (response.success) {
          // Filter only NoSQL databases
          const nosqlDbs = response.data.databases.filter((db: any) => 
            ['mongodb', 'redis', 'cassandra', 'dynamodb'].includes(db.type)
          );
          setDatabases(nosqlDbs);
        }
      } catch (error) {
        console.error('Error fetching NoSQL databases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">NoSQL Databases</h1>
        <p className="text-gray-600 mt-2">Manage your document and key-value stores</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">NoSQL Database Instances</h2>
        <div className="space-y-4">
          {databases.map((db, index) => (
            <motion.div
              key={db.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ServerIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{db.name}</h3>
                    <p className="text-sm text-gray-500">{db.type.toUpperCase()} {db.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{db.connections} connections</p>
                    <p className="text-sm text-gray-500">{db.size}</p>
                  </div>
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DatabaseBackups: React.FC = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await getDatabaseBackups();
        if (response.success) {
          setBackups(response.data.backups);
        }
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Database Backups</h1>
          <p className="text-gray-600 mt-2">Manage your database backups and restore points</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Backup
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Backups</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Database
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup, index) => (
                <motion.tr
                  key={backup.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{backup.databaseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(backup.status)} capitalize`}>
                      {backup.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(backup.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Restore
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      Download
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
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

const DatabaseMigrations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Database Migrations</h1>
        <p className="text-gray-600 mt-2">Manage database schema changes and migrations</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <WrenchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Migration Management</h3>
          <p className="text-gray-500 mb-6">Track and manage database schema changes</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Run Migration
          </button>
        </div>
      </div>
    </div>
  );
};

const Databases: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/databases"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/databases'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/databases/sql"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/databases/sql'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SQL Databases
          </Link>
          <Link
            to="/databases/nosql"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/databases/nosql'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            NoSQL Databases
          </Link>
          <Link
            to="/databases/backups"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/databases/backups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Backups
          </Link>
          <Link
            to="/databases/migrations"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/databases/migrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Migrations
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<DatabasesMain />} />
        <Route path="/sql" element={<SQLDatabases />} />
        <Route path="/nosql" element={<NoSQLDatabases />} />
        <Route path="/backups" element={<DatabaseBackups />} />
        <Route path="/migrations" element={<DatabaseMigrations />} />
      </Routes>
    </div>
  );
};

export default Databases;