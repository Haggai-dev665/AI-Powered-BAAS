import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIPlayground from './pages/AIPlayground';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import APIManagement from './pages/APIManagement';
import Databases from './pages/Databases';
import AIServices from './pages/AIServices';
import Storage from './pages/Storage';
import Users from './pages/Users';
import Monitoring from './pages/Monitoring';
import Communication from './pages/Communication';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/*" element={<Analytics />} />
          <Route path="/api/*" element={<APIManagement />} />
          <Route path="/playground" element={<AIPlayground />} />
          <Route path="/projects" element={<Projects />} />
          
          {/* Database Management Routes */}
          <Route path="/databases/*" element={<Databases />} />
          
          {/* AI Services Routes */}
          <Route path="/ai/*" element={<AIServices />} />
          
          {/* Storage Routes */}
          <Route path="/storage/*" element={<Storage />} />
          
          {/* User Management Routes */}
          <Route path="/users/*" element={<Users />} />
          
          {/* Monitoring Routes */}
          <Route path="/monitoring/*" element={<Monitoring />} />
          
          {/* Communication Routes */}
          <Route path="/communication/*" element={<Communication />} />
          
          {/* Billing Routes */}
          <Route path="/billing/*" element={<Billing />} />
          
          {/* Settings Routes */}
          <Route path="/settings/*" element={<Settings />} />
          
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;