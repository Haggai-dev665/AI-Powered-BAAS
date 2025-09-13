import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  CogIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserCircleIcon,
  BellIcon,
  PaintBrushIcon,
  LanguageIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { getSettings } from '../utils/api';

const SettingsMain: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your application settings and preferences</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Settings Overview */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Organization</p>
                <p className="text-xl font-bold">{settings.general.organizationName}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Security</p>
                <p className="text-xl font-bold">
                  {settings.security.twoFactorEnabled ? 'Enhanced' : 'Standard'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <GlobeAltIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Integrations</p>
                <p className="text-xl font-bold">
                  {Object.values(settings.integrations).filter((integration: any) => integration.enabled).length} Active
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/settings/general"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center">
            <CogIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              <p className="text-sm text-gray-600">Basic application settings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings/security"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-600">Security and privacy settings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings/integrations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
        >
          <div className="flex items-center">
            <GlobeAltIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
              <p className="text-sm text-gray-600">Third-party integrations</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Settings */}
      {settings && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Settings</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PaintBrushIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Use dark theme</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BellIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email alerts</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LanguageIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">{settings.general.language.toUpperCase()}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Timezone</p>
                      <p className="text-sm text-gray-500">{settings.general.timezone}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    organizationName: 'AI BaaS Platform',
    timezone: 'UTC',
    language: 'en',
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    autoSave: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
        <p className="text-gray-600 mt-2">Configure basic application settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={settings.organizationName}
              onChange={(e) => updateSetting('organizationName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto-save Changes</h3>
              <p className="text-sm text-gray-500">Automatically save changes as you make them</p>
            </div>
            <button
              onClick={() => updateSetting('autoSave', !settings.autoSave)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 3600,
    passwordPolicy: 'strong',
    ipWhitelisting: false,
    loginAlerts: true,
    apiKeyRotation: 30
  });

  const updateSetting = (key: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-2">Configure security and privacy settings</p>
      </div>

      {/* Authentication Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Authentication & Access</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => updateSetting('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (seconds)
            </label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Policy
            </label>
            <select
              value={securitySettings.passwordPolicy}
              onChange={(e) => updateSetting('passwordPolicy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="basic">Basic (8+ characters)</option>
              <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
              <option value="complex">Complex (16+ chars, symbols required)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">IP Whitelisting</h3>
              <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
            </div>
            <button
              onClick={() => updateSetting('ipWhitelisting', !securitySettings.ipWhitelisting)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.ipWhitelisting ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.ipWhitelisting ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Login Alerts</h3>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <button
              onClick={() => updateSetting('loginAlerts', !securitySettings.loginAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.loginAlerts ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* API Security */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">API Security</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key Rotation (days)
            </label>
            <input
              type="number"
              value={securitySettings.apiKeyRotation}
              onChange={(e) => updateSetting('apiKeyRotation', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Automatically rotate API keys every specified number of days
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <KeyIcon className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Current API Key</p>
                <p className="text-sm text-gray-500">Last rotated 15 days ago</p>
              </div>
            </div>
            <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
              Rotate Now
            </button>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h2>
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Security Score: Excellent</p>
            <p className="text-sm text-gray-500">All security recommendations are enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationsSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    github: { enabled: true, connected: true, webhook: 'https://api.github.com/webhook' },
    slack: { enabled: true, connected: false, webhook: '' },
    discord: { enabled: false, connected: false, webhook: '' },
    webhook: { enabled: true, url: 'https://api.example.com/webhooks' }
  });

  const toggleIntegration = (key: string) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: { ...(prev as any)[key], enabled: !(prev as any)[key].enabled }
    }));
  };

  const getStatusColor = (integration: any) => {
    if (!integration.enabled) return 'bg-gray-100 text-gray-800';
    if (integration.connected) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (integration: any) => {
    if (!integration.enabled) return 'Disabled';
    if (integration.connected) return 'Connected';
    return 'Not Connected';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-2">Manage third-party integrations and webhooks</p>
      </div>

      {/* Third-party Integrations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Third-party Services</h2>
        
        <div className="space-y-6">
          {Object.entries(integrations).filter(([key]) => key !== 'webhook').map(([key, integration]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <GlobeAltIcon className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{key}</h3>
                  <p className="text-sm text-gray-500">
                    {key === 'github' && 'Source code integration and deployments'}
                    {key === 'slack' && 'Team communication and notifications'}
                    {key === 'discord' && 'Community chat and alerts'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration)}`}>
                  {getStatusText(integration)}
                </span>
                <button
                  onClick={() => toggleIntegration(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    integration.enabled ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      integration.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Webhook Configuration</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enable Webhooks</h3>
              <p className="text-sm text-gray-500">Send HTTP callbacks for events</p>
            </div>
            <button
              onClick={() => toggleIntegration('webhook')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.webhook.enabled ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.webhook.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {integrations.webhook.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={integrations.webhook.url}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  webhook: { ...prev.webhook, url: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://your-domain.com/webhook"
              />
            </div>
          )}
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Active Integrations</p>
                <p className="text-sm text-gray-500">
                  {Object.values(integrations).filter((int: any) => int.enabled).length} of {Object.keys(integrations).length} enabled
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Pending Setup</p>
                <p className="text-sm text-gray-500">
                  {Object.values(integrations).filter((int: any) => int.enabled && !int.connected).length} integrations need configuration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/settings"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/settings/general"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/settings/general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </Link>
          <Link
            to="/settings/security"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/settings/security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </Link>
          <Link
            to="/settings/integrations"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/settings/integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Integrations
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<SettingsMain />} />
        <Route path="/general" element={<GeneralSettings />} />
        <Route path="/security" element={<SecuritySettings />} />
        <Route path="/integrations" element={<IntegrationsSettings />} />
      </Routes>
    </div>
  );
};

export default Settings;