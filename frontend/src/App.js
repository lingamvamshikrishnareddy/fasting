// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Layout Components
import Header from './components/Header';


// Public Pages
import HomePage from './components/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import HealthBenefits from './pages/HealthBenefits';

// Protected Pages
import Dashboard from './pages/Dashboard';
import FastingTimer from './components/FastingTimer';
import WeightTracker from './components/WeightTracker';
import YogaExercises from './pages/YogaExercises';
import BMRCalculator from './components/BMRCalculator';
import JourneyLog from './pages/JourneyLog';

// Styles
import './styles/index.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/health-benefits" element={<HealthBenefits />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fasting-timer" element={<FastingTimer />} />
              <Route path="/weight-tracker" element={<WeightTracker />} />
              <Route path="/yoga-exercises" element={<YogaExercises />} />
              <Route path="/bmr-calculator" element={<BMRCalculator />} />
              <Route path="/journey-log" element={<JourneyLog />} />
            </Route>

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        
      </div>
    </AuthProvider>
  );
};

export default App;
