import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { getCommunicationStats } from '../utils/api';

const CommunicationMain: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getCommunicationStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching communication stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
          <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
          <p className="text-gray-600 mt-2">Manage messaging, notifications, and communication channels</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
          Send Message
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Email Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <EnvelopeIcon className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium opacity-90">Email Sent</p>
                <p className="text-2xl font-bold">{stats.email.sent.toLocaleString()}</p>
              </div>
              <div className="text-right text-sm">
                <p className="opacity-90">Delivered: {((stats.email.delivered / stats.email.sent) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>

          {/* SMS Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <PhoneIcon className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium opacity-90">SMS Sent</p>
                <p className="text-2xl font-bold">{stats.sms.sent.toLocaleString()}</p>
              </div>
              <div className="text-right text-sm">
                <p className="opacity-90">Success: {((stats.sms.delivered / stats.sms.sent) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>

          {/* Push Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <MegaphoneIcon className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium opacity-90">Push Sent</p>
                <p className="text-2xl font-bold">{stats.push.sent.toLocaleString()}</p>
              </div>
              <div className="text-right text-sm">
                <p className="opacity-90">Opened: {((stats.push.opened / stats.push.sent) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>

          {/* Live Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <ChatBubbleLeftRightIcon className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium opacity-90">Active Chats</p>
                <p className="text-2xl font-bold">{stats.chat.activeChannels}</p>
              </div>
              <div className="text-right text-sm">
                <p className="opacity-90">Avg Response: {stats.chat.averageResponse}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Communication Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/communication/chat"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-600">Real-time customer support</p>
            </div>
          </div>
        </Link>

        <Link
          to="/communication/email"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Service</h3>
              <p className="text-sm text-gray-600">Transactional emails</p>
            </div>
          </div>
        </Link>

        <Link
          to="/communication/sms"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
        >
          <div className="flex items-center">
            <PhoneIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">SMS Service</h3>
              <p className="text-sm text-gray-600">Text messaging API</p>
            </div>
          </div>
        </Link>

        <Link
          to="/communication/push"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500"
        >
          <div className="flex items-center">
            <MegaphoneIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Mobile push messages</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Communication Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <EnvelopeIcon className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Email campaign sent</p>
                  <p className="text-sm text-gray-500">Monthly newsletter to 5,234 subscribers</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">10 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Live chat session started</p>
                  <p className="text-sm text-gray-500">Customer support ticket #CS-1234</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">25 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MegaphoneIcon className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Push notification delivered</p>
                  <p className="text-sm text-gray-500">App update reminder to 12,456 users</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveChat: React.FC = () => {
  const [activeChats, setActiveChats] = useState([
    {
      id: 1,
      customer: 'Alice Johnson',
      status: 'active',
      lastMessage: 'I need help with my account setup',
      timestamp: '2024-01-20T15:30:00Z',
      agent: 'Support Agent 1'
    },
    {
      id: 2,
      customer: 'Bob Smith',
      status: 'waiting',
      lastMessage: 'Hello, is anyone there?',
      timestamp: '2024-01-20T15:25:00Z',
      agent: null
    },
    {
      id: 3,
      customer: 'Carol Davis',
      status: 'resolved',
      lastMessage: 'Thank you for your help!',
      timestamp: '2024-01-20T15:10:00Z',
      agent: 'Support Agent 2'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Chat</h1>
          <p className="text-gray-600 mt-2">Manage real-time customer conversations</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Go Online
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Settings
          </button>
        </div>
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeChats.filter(chat => chat.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeChats.filter(chat => chat.status === 'waiting').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">2m 34s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Chats */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeChats.map((chat, index) => (
                <motion.tr
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {chat.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{chat.customer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(chat.status)} capitalize`}>
                      {chat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {chat.lastMessage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chat.agent || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Join
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Assign
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

const EmailService: React.FC = () => {
  const [emailStats, setEmailStats] = useState({
    sent: 15847,
    delivered: 15234,
    opened: 12456,
    clicked: 3456,
    bounced: 123
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Service</h1>
          <p className="text-gray-600 mt-2">Manage transactional and marketing emails</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Send Campaign
        </button>
      </div>

      {/* Email Performance */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <EnvelopeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{emailStats.sent.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Sent</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{emailStats.delivered.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Delivered</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <EyeIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{emailStats.opened.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Opened</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <PencilIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{emailStats.clicked.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Clicked</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{emailStats.bounced.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Bounced</p>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              value="smtp.aibaas.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <input
              type="email"
              value="noreply@aibaas.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SMSService: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SMS Service</h1>
        <p className="text-gray-600 mt-2">Send text messages via API</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <PhoneIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">SMS API Service</h3>
          <p className="text-gray-500 mb-6">Send transactional SMS messages to your users</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Configure SMS
          </button>
        </div>
      </div>
    </div>
  );
};

const PushNotifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Push Notifications</h1>
        <p className="text-gray-600 mt-2">Send mobile push notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <MegaphoneIcon className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Push Notification Service</h3>
          <p className="text-gray-500 mb-6">Send push notifications to mobile devices</p>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Setup Push
          </button>
        </div>
      </div>
    </div>
  );
};

const Communication: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/communication"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/communication'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/communication/chat"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/communication/chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Live Chat
          </Link>
          <Link
            to="/communication/email"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/communication/email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email
          </Link>
          <Link
            to="/communication/sms"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/communication/sms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SMS
          </Link>
          <Link
            to="/communication/push"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/communication/push'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Push
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<CommunicationMain />} />
        <Route path="/chat" element={<LiveChat />} />
        <Route path="/email" element={<EmailService />} />
        <Route path="/sms" element={<SMSService />} />
        <Route path="/push" element={<PushNotifications />} />
      </Routes>
    </div>
  );
};

export default Communication;