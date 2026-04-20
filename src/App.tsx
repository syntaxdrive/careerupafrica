import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import HRPage from './pages/HRPage';
import TalentPage from './pages/TalentPage';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Header from './components/Header';
import { CareerUpLoader } from './components/CareerUpLoader';
import { useAuthStore } from './stores/authStore';
import './App.css';

function App() {
  const { initialized, initialize } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initialize();
    
    // Show the branding loader for at least 2.5 seconds so it can be seen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [initialize]);

  if (!initialized || showSplash) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <CareerUpLoader />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/talent" element={<TalentPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/hr" element={<HRPage />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
