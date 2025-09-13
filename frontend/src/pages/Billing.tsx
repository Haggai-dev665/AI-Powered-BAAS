import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getBillingUsage, getBillingInvoices } from '../utils/api';

const BillingMain: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await getBillingUsage();
        if (response.success) {
          setUsageData(response.data);
        }
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
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
          <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600 mt-2">Monitor usage, costs, and manage payments</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Download Invoice
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Current Bill Summary */}
      {usageData && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Month Bill</h2>
              <p className="text-blue-100">
                Billing period: {new Date(usageData.currentPeriod.start).toLocaleDateString()} - {new Date(usageData.currentPeriod.end).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">${usageData.costs.total}</p>
              <p className="text-blue-100">Total Cost</p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Metrics */}
      {usageData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <ChartBarIcon className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageData.currentPeriod.apiCalls.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">${usageData.costs.apiCalls}</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(usageData.currentPeriod.apiCalls / usageData.limits.apiCalls) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageData.currentPeriod.storage}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">${usageData.costs.storage}</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <ArrowPathIcon className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-600">Bandwidth</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageData.currentPeriod.bandwidth}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">${usageData.costs.bandwidth}</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <CurrencyDollarIcon className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-sm font-medium text-gray-600">AI Inference</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageData.currentPeriod.aiInference.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-600">${usageData.costs.aiInference}</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/billing/usage"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Usage Analytics</h3>
              <p className="text-sm text-gray-600">Detailed usage reports</p>
            </div>
          </div>
        </Link>

        <Link
          to="/billing/invoices"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
              <p className="text-sm text-gray-600">View payment history</p>
            </div>
          </div>
        </Link>

        <Link
          to="/billing/subscription"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
        >
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
              <p className="text-sm text-gray-600">Manage your plan</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h2>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Payment Method Active</p>
              <p className="text-sm text-gray-500">Visa ending in 4242 • Expires 12/26</p>
            </div>
          </div>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

const UsageAnalytics: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await getBillingUsage();
        if (response.success) {
          setUsageData(response.data);
        }
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
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
        <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed breakdown of your resource usage</p>
      </div>

      {/* Usage Summary */}
      {usageData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Period Usage</h2>
          
          <div className="space-y-6">
            {/* API Calls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">API Calls</span>
                <span className="text-sm text-gray-600">
                  {usageData.currentPeriod.apiCalls.toLocaleString()} / {usageData.limits.apiCalls.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(usageData.currentPeriod.apiCalls / usageData.limits.apiCalls) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cost: ${usageData.costs.apiCalls}</span>
                <span>{((usageData.currentPeriod.apiCalls / usageData.limits.apiCalls) * 100).toFixed(1)}% used</span>
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Storage</span>
                <span className="text-sm text-gray-600">
                  {usageData.currentPeriod.storage} / {usageData.limits.storage}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cost: ${usageData.costs.storage}</span>
                <span>60% used</span>
              </div>
            </div>

            {/* Bandwidth */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Bandwidth</span>
                <span className="text-sm text-gray-600">
                  {usageData.currentPeriod.bandwidth} / {usageData.limits.bandwidth}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cost: ${usageData.costs.bandwidth}</span>
                <span>30% used</span>
              </div>
            </div>

            {/* AI Inference */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">AI Inference</span>
                <span className="text-sm text-gray-600">
                  {usageData.currentPeriod.aiInference.toLocaleString()} / {usageData.limits.aiInference.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(usageData.currentPeriod.aiInference / usageData.limits.aiInference) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cost: ${usageData.costs.aiInference}</span>
                <span>{((usageData.currentPeriod.aiInference / usageData.limits.aiInference) * 100).toFixed(1)}% used</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {usageData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">API Calls</span>
              <span className="text-sm font-bold text-gray-900">${usageData.costs.apiCalls}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Storage</span>
              <span className="text-sm font-bold text-gray-900">${usageData.costs.storage}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Bandwidth</span>
              <span className="text-sm font-bold text-gray-900">${usageData.costs.bandwidth}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">AI Inference</span>
              <span className="text-sm font-bold text-gray-900">${usageData.costs.aiInference}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-t-2 border-blue-500">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">${usageData.costs.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getBillingInvoices();
        if (response.success) {
          setInvoices(response.data.invoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusIcon = (status: string) => {
    return status === 'paid' 
      ? <CheckCircleIcon className="h-5 w-5 text-green-500" />
      : <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ArrowPathIcon className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">View and download your billing history</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Download All
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invoice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)} capitalize`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <ArrowDownTrayIcon className="h-4 w-4" />
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

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('Professional');

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      features: ['100,000 API calls', '10 GB Storage', 'Basic Support'],
      current: false
    },
    {
      name: 'Professional',
      price: '$99',
      features: ['1,000,000 API calls', '100 GB Storage', 'Priority Support', 'Advanced Analytics'],
      current: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      features: ['Unlimited API calls', '1 TB Storage', '24/7 Support', 'Custom Features'],
      current: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600 mt-2">Manage your subscription plan and billing details</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{currentPlan}</h3>
            <p className="text-gray-600">$99/month • Renews on Jan 25, 2024</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-6 ${
                plan.current
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}<span className="text-sm text-gray-500">/month</span></p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{feature}</li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    plan.current
                      ? 'bg-blue-600 text-white cursor-default'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2026</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const Billing: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/billing"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/billing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/billing/usage"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/billing/usage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usage
          </Link>
          <Link
            to="/billing/invoices"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/billing/invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invoices
          </Link>
          <Link
            to="/billing/subscription"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/billing/subscription'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Subscription
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<BillingMain />} />
        <Route path="/usage" element={<UsageAnalytics />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </div>
  );
};

export default Billing;