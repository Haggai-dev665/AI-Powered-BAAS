import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Core Dashboard
  HomeIcon,
  ChartBarIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  
  // API Management
  KeyIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CogIcon,
  
  // Database Management
  CircleStackIcon,
  TableCellsIcon,
  ServerIcon,
  CloudIcon,
  
  // AI & ML
  BeakerIcon,
  LightBulbIcon,
  AcademicCapIcon,
  SparklesIcon,
  
  // Analytics & Monitoring
  EyeIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  
  // User Management
  UsersIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  
  // File & Storage
  FolderIcon,
  PhotoIcon,
  DocumentIcon,
  ArchiveBoxIcon,
  
  // Communication
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MegaphoneIcon,
  
  // Additional Features
  WrenchIcon,
  MapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Real-time insights',
    children: [
      { id: 'realtime', name: 'Real-time Metrics', href: '/analytics/realtime', icon: EyeIcon },
      { id: 'reports', name: 'Reports', href: '/analytics/reports', icon: DocumentTextIcon },
      { id: 'performance', name: 'Performance', href: '/analytics/performance', icon: RocketLaunchIcon }
    ]
  },
  {
    id: 'api-management',
    name: 'API Management',
    href: '/api',
    icon: GlobeAltIcon,
    description: 'Manage APIs and keys',
    children: [
      { id: 'api-keys', name: 'API Keys', href: '/api/keys', icon: KeyIcon, badge: 'New' },
      { id: 'endpoints', name: 'Endpoints', href: '/api/endpoints', icon: CodeBracketIcon },
      { id: 'documentation', name: 'Documentation', href: '/api/docs', icon: DocumentTextIcon },
      { id: 'rate-limiting', name: 'Rate Limiting', href: '/api/rate-limiting', icon: ClockIcon },
      { id: 'webhooks', name: 'Webhooks', href: '/api/webhooks', icon: BellIcon }
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    href: '/databases',
    icon: CircleStackIcon,
    description: 'SQL & NoSQL management',
    children: [
      { id: 'sql', name: 'SQL Databases', href: '/databases/sql', icon: TableCellsIcon },
      { id: 'nosql', name: 'NoSQL Databases', href: '/databases/nosql', icon: ServerIcon },
      { id: 'backups', name: 'Backups', href: '/databases/backups', icon: ArchiveBoxIcon },
      { id: 'migrations', name: 'Migrations', href: '/databases/migrations', icon: WrenchIcon }
    ]
  },
  {
    id: 'ai-services',
    name: 'AI Services',
    href: '/ai',
    icon: SparklesIcon,
    description: 'AI models and processing',
    children: [
      { id: 'playground', name: 'AI Playground', href: '/ai/playground', icon: BeakerIcon },
      { id: 'models', name: 'Model Management', href: '/ai/models', icon: CpuChipIcon },
      { id: 'training', name: 'Model Training', href: '/ai/training', icon: AcademicCapIcon },
      { id: 'inference', name: 'Inference Engine', href: '/ai/inference', icon: LightBulbIcon }
    ]
  },
  {
    id: 'storage',
    name: 'File Storage',
    href: '/storage',
    icon: FolderIcon,
    description: 'File and media storage',
    children: [
      { id: 'files', name: 'File Manager', href: '/storage/files', icon: DocumentIcon },
      { id: 'media', name: 'Media Library', href: '/storage/media', icon: PhotoIcon },
      { id: 'cdn', name: 'CDN Settings', href: '/storage/cdn', icon: CloudIcon }
    ]
  },
  {
    id: 'users',
    name: 'User Management',
    href: '/users',
    icon: UsersIcon,
    description: 'Users and permissions',
    children: [
      { id: 'user-list', name: 'Users', href: '/users/list', icon: UserCircleIcon },
      { id: 'roles', name: 'Roles & Permissions', href: '/users/roles', icon: ShieldCheckIcon },
      { id: 'authentication', name: 'Authentication', href: '/users/auth', icon: IdentificationIcon }
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    href: '/monitoring',
    icon: EyeIcon,
    description: 'System health and alerts',
    children: [
      { id: 'health', name: 'System Health', href: '/monitoring/health', icon: ExclamationTriangleIcon },
      { id: 'logs', name: 'Logs', href: '/monitoring/logs', icon: DocumentTextIcon },
      { id: 'alerts', name: 'Alerts', href: '/monitoring/alerts', icon: BellIcon }
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    href: '/communication',
    icon: ChatBubbleLeftRightIcon,
    description: 'Messaging and notifications',
    children: [
      { id: 'chat', name: 'Live Chat', href: '/communication/chat', icon: ChatBubbleLeftRightIcon },
      { id: 'email', name: 'Email Service', href: '/communication/email', icon: EnvelopeIcon },
      { id: 'sms', name: 'SMS Service', href: '/communication/sms', icon: PhoneIcon },
      { id: 'push', name: 'Push Notifications', href: '/communication/push', icon: MegaphoneIcon }
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    href: '/projects',
    icon: FolderIcon,
    description: 'Manage your projects'
  },
  {
    id: 'billing',
    name: 'Billing',
    href: '/billing',
    icon: CurrencyDollarIcon,
    description: 'Usage and payments',
    children: [
      { id: 'usage', name: 'Usage Analytics', href: '/billing/usage', icon: ChartBarIcon },
      { id: 'invoices', name: 'Invoices', href: '/billing/invoices', icon: DocumentTextIcon },
      { id: 'subscription', name: 'Subscription', href: '/billing/subscription', icon: CalendarIcon }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    description: 'Application settings',
    children: [
      { id: 'general', name: 'General', href: '/settings/general', icon: CogIcon },
      { id: 'security', name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
      { id: 'integrations', name: 'Integrations', href: '/settings/integrations', icon: GlobeAltIcon }
    ]
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics']);
  const location = useLocation();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  const isParentActive = (item: SidebarItem) => {
    if (isActive(item.href)) return true;
    return item.children?.some(child => isActive(child.href)) || false;
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const parentActive = isParentActive(item);

    return (
      <div key={item.id} className="mb-1">
        <div className="relative group">
          <Link
            to={item.href}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleExpanded(item.id);
              }
            }}
            className={`
              flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 relative overflow-hidden
              ${level > 0 ? 'ml-4 pl-6' : ''}
              ${active 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : parentActive && !active
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            {/* Active indicator */}
            {active && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}

            {/* Icon */}
            <Icon className={`
              h-5 w-5 flex-shrink-0
              ${isCollapsed ? 'mx-auto' : 'mr-3'}
              ${active ? 'text-white' : 'text-gray-500'}
            `} />

            {/* Content */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{item.name}</div>
                      {item.description && level === 0 && (
                        <div className={`text-xs mt-0.5 truncate ${
                          active ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Expand icon */}
                    {hasChildren && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 
                          invisible group-hover:visible bg-gray-900 text-white text-sm 
                          px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
              {item.name}
              {item.description && (
                <div className="text-xs text-gray-300 mt-1">{item.description}</div>
              )}
            </div>
          )}
        </div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children?.map(child => renderSidebarItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      animate={{
        width: isCollapsed ? '4rem' : '20rem'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 shadow-lg h-full flex flex-col relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <CpuChipIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-bold text-lg text-gray-900">AI BaaS</div>
                  <div className="text-xs text-gray-500">Management Console</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isCollapsed ? (
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            ) : (
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <nav className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-xs text-gray-500 mb-2">
                © 2024 AI-Powered BaaS
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">System Online</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;