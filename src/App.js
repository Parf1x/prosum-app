// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Импорт страниц
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// Импорты для защищенных страниц (пока заглушки)
import DashboardPage from './pages/DashboardPage'; // Создайте заглушку
import ProjectDetailPage from './pages/ProjectDetailPage'; // Создайте заглушку
import CreateProjectPage from './pages/CreateProjectPage'; // Создайте заглушку
import EditProjectPage from './pages/EditProjectPage'; // Создайте заглушку
import UserProfilePage from './pages/UserProfilePage'; // Создайте заглушку

// Импорт компонентов макета
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute'; // Импортируем ProtectedRoute

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            {/* Публичные роуты */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Защищенные роуты */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/project/new" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
            <Route path="/project/:projectId/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
            <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

            {/* Редирект для всех неизвестных путей */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;