import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">AI-Powered BaaS</h3>
            <p className="text-primary-200 mb-4">
              The next-generation Backend as a Service platform with native AI capabilities.
              Built with Rust, Node.js, Python, and React with TypeScript.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-300">Tech Stack:</span>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-primary-800 rounded text-xs">Rust</span>
                <span className="px-2 py-1 bg-primary-800 rounded text-xs">React + TS</span>
                <span className="px-2 py-1 bg-primary-800 rounded text-xs">Node.js</span>
                <span className="px-2 py-1 bg-primary-800 rounded text-xs">Python</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-md font-semibold mb-4">AI Features</h4>
            <ul className="space-y-2 text-primary-200">
              <li>Gemini API Integration</li>
              <li>Text Generation</li>
              <li>Sentiment Analysis</li>
              <li>Real-time Processing</li>
              <li>Custom Model Training</li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-md font-semibold mb-4">Technologies</h4>
            <ul className="space-y-2 text-primary-200">
              <li>Rust Core Services</li>
              <li>React + TypeScript</li>
              <li>Node.js API Gateway</li>
              <li>Python AI Services</li>
              <li>WebSocket Real-time</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-primary-300">
            <span>Built with</span>
            <HeartIcon className="h-4 w-4 text-red-500" />
            <span>by the AI BaaS Team</span>
          </div>
          <div className="text-primary-300 text-sm mt-4 md:mt-0">
            © 2024 AI-Powered BaaS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;