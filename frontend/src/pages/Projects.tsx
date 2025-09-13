import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  FolderIcon, 
  CpuChipIcon,
  CalendarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { getProjects, createProject } from '../utils/api';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    ai_models: ['gemini-pro']
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await createProject(newProject);
      if (response.success && response.data) {
        setProjects(prev => [...prev, response.data!]);
        setShowCreateModal(false);
        setNewProject({ name: '', description: '', ai_models: ['gemini-pro'] });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="flex justify-between items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-4">Projects</h1>
          <p className="text-xl text-primary-600">
            Manage your AI-powered applications and services
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Project</span>
        </motion.button>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FolderIcon className="h-24 w-24 text-primary-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-primary-900 mb-4">No Projects Yet</h3>
          <p className="text-primary-600 mb-8 max-w-md mx-auto">
            Create your first project to start building with AI-powered backend services.
          </p>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Project
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="card group hover:shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FolderIcon className="h-6 w-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 group-hover:text-primary-700 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-primary-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-primary-400 group-hover:text-primary-600 transition-colors" />
              </div>

              {project.description && (
                <p className="text-primary-700 mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-primary-800 mb-2">AI Models</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.ai_models.map((model) => (
                      <span 
                        key={model}
                        className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs flex items-center space-x-1"
                      >
                        <CpuChipIcon className="h-3 w-3" />
                        <span>{model}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-primary-600">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field h-24"
                  placeholder="Describe your project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  AI Models
                </label>
                <div className="space-y-2">
                  {['gemini-pro', 'custom-classifier'].map((model) => (
                    <label key={model} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProject.ai_models.includes(model)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProject(prev => ({
                              ...prev,
                              ai_models: [...prev.ai_models, model]
                            }));
                          } else {
                            setNewProject(prev => ({
                              ...prev,
                              ai_models: prev.ai_models.filter(m => m !== model)
                            }));
                          }
                        }}
                        className="rounded border-primary-300 text-primary-900 focus:ring-primary-900"
                      />
                      <span className="text-sm text-primary-700">{model}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Project
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Projects;