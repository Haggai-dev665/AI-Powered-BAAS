import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIPlayground from './pages/AIPlayground';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import APIManagement from './pages/APIManagement';

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
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;