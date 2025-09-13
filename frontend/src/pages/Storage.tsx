import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  CloudIcon,
  ArchiveBoxIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  EyeIcon,
  TrashIcon,
  ShareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getStorageStats, getStorageFiles } from '../utils/api';

const StorageMain: React.FC = () => {
  const [storageStats, setStorageStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        const response = await getStorageStats();
        if (response.success) {
          setStorageStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching storage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorageStats();
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
          <h1 className="text-3xl font-bold text-gray-900">File Storage</h1>
          <p className="text-gray-600 mt-2">Manage your files and media storage</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload Files
        </button>
      </div>

      {/* Storage Overview */}
      {storageStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white"
          >
            <div className="flex items-center">
              <ArchiveBoxIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Total Storage</p>
                <p className="text-2xl font-bold">{storageStats.totalStorage}</p>
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
              <FolderIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Used Storage</p>
                <p className="text-2xl font-bold">{storageStats.usedStorage}</p>
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
              <CloudIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Available</p>
                <p className="text-2xl font-bold">{storageStats.availableStorage}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Storage Usage Chart */}
      {storageStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Used: {storageStats.usedStorage}</span>
              <span>{storageStats.usage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                style={{ width: `${storageStats.usage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <PhotoIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{storageStats.files.images.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Images</p>
            </div>
            <div className="text-center">
              <DocumentIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{storageStats.files.documents.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Documents</p>
            </div>
            <div className="text-center">
              <CloudIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{storageStats.files.videos.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Videos</p>
            </div>
            <div className="text-center">
              <ArchiveBoxIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">{storageStats.files.other.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Other</p>
            </div>
          </div>
        </div>
      )}

      {/* CDN Stats */}
      {storageStats?.cdn && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">CDN Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{storageStats.cdn.requests.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{storageStats.cdn.bandwidth}</p>
              <p className="text-sm text-gray-600">Bandwidth Used</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{storageStats.cdn.cacheHitRate}%</p>
              <p className="text-sm text-gray-600">Cache Hit Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/storage/files"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">File Manager</h3>
              <p className="text-sm text-gray-600">Browse and manage files</p>
            </div>
          </div>
        </Link>

        <Link
          to="/storage/media"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
        >
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Media Library</h3>
              <p className="text-sm text-gray-600">Manage images and videos</p>
            </div>
          </div>
        </Link>

        <Link
          to="/storage/cdn"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
        >
          <div className="flex items-center">
            <CloudIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">CDN Settings</h3>
              <p className="text-sm text-gray-600">Configure content delivery</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getStorageFiles();
        if (response.success) {
          setFiles(response.data.files);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-blue-600" />;
      case 'video':
        return <CloudIcon className="h-8 w-8 text-purple-600" />;
      case 'document':
        return <DocumentIcon className="h-8 w-8 text-green-600" />;
      default:
        return <ArchiveBoxIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-600 mt-2">Browse and manage your files</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Files ({filteredFiles.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file, index) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{file.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {file.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploaded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 mr-4">
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
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

const MediaLibrary: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getStorageFiles();
        if (response.success) {
          // Filter only media files
          const mediaFiles = response.data.files.filter((file: any) => 
            ['image', 'video'].includes(file.type)
          );
          setFiles(mediaFiles);
        }
      } catch (error) {
        console.error('Error fetching media files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">Manage your images and videos</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload Media
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Files</h2>
        {files.length === 0 ? (
          <div className="text-center py-8">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No media files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  {file.type === 'image' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CloudIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                      <EyeIcon className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                      <ArrowDownTrayIcon className="h-4 w-4 text-gray-700" />
                    </button>
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

const CDNSettings: React.FC = () => {
  const [cdnEnabled, setCdnEnabled] = useState(true);
  const [cacheSettings, setCacheSettings] = useState({
    ttl: '3600',
    compression: true,
    minify: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CDN Settings</h1>
        <p className="text-gray-600 mt-2">Configure content delivery network settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">CDN Configuration</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enable CDN</h3>
              <p className="text-sm text-gray-500">Accelerate content delivery globally</p>
            </div>
            <button
              onClick={() => setCdnEnabled(!cdnEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                cdnEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  cdnEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cache TTL (seconds)
            </label>
            <input
              type="number"
              value={cacheSettings.ttl}
              onChange={(e) => setCacheSettings({...cacheSettings, ttl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Enable Compression</h3>
                <p className="text-sm text-gray-500">Compress files for faster delivery</p>
              </div>
              <button
                onClick={() => setCacheSettings({...cacheSettings, compression: !cacheSettings.compression})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  cacheSettings.compression ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cacheSettings.compression ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Minify Assets</h3>
                <p className="text-sm text-gray-500">Minify CSS and JavaScript files</p>
              </div>
              <button
                onClick={() => setCacheSettings({...cacheSettings, minify: !cacheSettings.minify})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  cacheSettings.minify ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cacheSettings.minify ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">CDN Endpoints</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Global CDN URL</p>
            <p className="text-sm text-gray-600 font-mono">https://cdn.aibaas.com</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Regional CDN URL (US East)</p>
            <p className="text-sm text-gray-600 font-mono">https://us-east.cdn.aibaas.com</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Regional CDN URL (EU West)</p>
            <p className="text-sm text-gray-600 font-mono">https://eu-west.cdn.aibaas.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Storage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/storage"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/storage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/storage/files"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/storage/files'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            File Manager
          </Link>
          <Link
            to="/storage/media"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/storage/media'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Media Library
          </Link>
          <Link
            to="/storage/cdn"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/storage/cdn'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            CDN Settings
          </Link>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<StorageMain />} />
        <Route path="/files" element={<FileManager />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/cdn" element={<CDNSettings />} />
      </Routes>
    </div>
  );
};

export default Storage;