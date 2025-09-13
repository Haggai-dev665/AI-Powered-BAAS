import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AIPlayground from './pages/AIPlayground';
import Projects from './pages/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100">
        <Header />
        
        <motion.main 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playground" element={<AIPlayground />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </motion.main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;