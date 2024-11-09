import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import HomePage from './components/HomePage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Make sure this path is correct
import FastingTimer from './components/FastingTimer';
import WeightTracker from './components/WeightTracker';
import YogaExercises from './pages/YogaExercises';
import BMRCalculator from './components/BMRCalculator';
import JourneyLog from './pages/JourneyLog';
import HealthBenefits from './pages/HealthBenefits';

import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/fasting-timer" component={FastingTimer} />
          <PrivateRoute path="/weight-tracker" component={WeightTracker} />
          <PrivateRoute path="/yoga-exercises" component={YogaExercises} />
          <PrivateRoute path="/bmr-calculator" component={BMRCalculator} />
          <PrivateRoute path="/journey-log" component={JourneyLog} />
          <PrivateRoute path="/health-benefits" component={HealthBenefits} />
          
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;