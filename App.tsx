
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';
import Community from './pages/Community';
import Listao from './pages/Listao';
import Prayers from './pages/Prayers';
import Formation from './pages/Formation';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ejc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsReady(true);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ejc_user');
    setUser(null);
  };

  if (!isReady) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/listao" element={<Listao />} />
          <Route path="/oracoes" element={<Prayers />} />
          <Route path="/formacao" element={<Formation />} />
          <Route path="/perfil" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/gamificacao" element={<Gamification user={user} />} />
          <Route path="/comunidade" element={<Community />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
