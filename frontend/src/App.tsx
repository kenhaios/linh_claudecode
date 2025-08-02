import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChartPage from './pages/ChartPage';
import ConsultationPage from './pages/ConsultationPage';
import PaymentPage from './pages/PaymentPage';
import NotFoundPage from './pages/NotFoundPage';

import { useAppSelector } from './hooks/redux';
import ProtectedRoute from './components/common/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Helmet>
        <title>Ha Linh - Tử Vi Trực Tuyến với AI</title>
        <meta 
          name="description" 
          content="Xem tử vi trực tuyến với AI tư vấn chuyên nghiệp. Lập lá số tử vi chính xác theo âm lịch Việt Nam." 
        />
        <meta 
          name="keywords" 
          content="tử vi, xem tử vi, tử vi online, lá số tử vi, âm lịch, AI tử vi" 
        />
        <meta name="author" content="Ha Linh Development Team" />
        <meta property="og:title" content="Ha Linh - Tử Vi Trực Tuyến với AI" />
        <meta 
          property="og:description" 
          content="Xem tử vi trực tuyến với AI tư vấn chuyên nghiệp. Lập lá số tử vi chính xác theo âm lịch Việt Nam." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <MainLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chart/:id?" 
            element={
              <ProtectedRoute>
                <ChartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/consultation/:id?" 
            element={
              <ProtectedRoute>
                <ConsultationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>

      {/* Global toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            fontSize: '14px',
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          },
          success: {
            style: {
              border: '1px solid #52c41a',
            },
          },
          error: {
            style: {
              border: '1px solid #ff4d4f',
            },
          },
        }}
      />
    </>
  );
};

export default App;