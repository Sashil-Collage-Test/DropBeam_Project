import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import DropBeamHomepage from './components/HomePage';
import DropBeam from './components/Dashboard';
import FileAccess from './components/FileAccess';
import DropBeamLogin from './components/LoginPage';

function FileAccessWrapper() {
  const { shortCode } = useParams();
  return <FileAccess shortCode={shortCode} />;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'dashboard') {
      navigate('/dashboard');
    } else if (page === 'login') {
      navigate('/login');
    }
    setCurrentPage(page || 'home');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <DropBeamHomepage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DropBeam onNavigate={handleNavigate} />;
      case 'file-access':
        return <FileAccess onNavigate={handleNavigate} />;
      case 'login':
        return <DropBeamLogin onNavigate={handleNavigate} />;
      default:
        return <DropBeamHomepage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<DropBeamHomepage onNavigate={handleNavigate} />} />
      <Route path="/dashboard" element={<DropBeam onNavigate={handleNavigate} />} />
      <Route path="/login" element={<DropBeamLogin onNavigate={handleNavigate} />} />
      <Route path="/f/:shortCode" element={<FileAccessWrapper />} />
      <Route path="*" element={
        <div className="App">
          {renderPage()}
          
          {/* Side Navigation */}
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50">
            <button 
              onClick={() => handleNavigate('home')}
              className={`group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1 ${currentPage === 'home' ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`}
              title="Home"
            >
              <span className="text-lg">🏠</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </button>
            <button 
              onClick={() => handleNavigate('dashboard')}
              className={`group relative bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1 ${currentPage === 'dashboard' ? 'ring-2 ring-green-300 ring-offset-2' : ''}`}
              title="Dashboard"
            >
              <span className="text-lg">📊</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </button>
            <button 
              onClick={() => handleNavigate('file-access')}
              className={`group relative bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1 ${currentPage === 'file-access' ? 'ring-2 ring-purple-300 ring-offset-2' : ''}`}
              title="File Access"
            >
              <span className="text-lg">🔐</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;