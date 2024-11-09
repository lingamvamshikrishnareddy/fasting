import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Dashboard() {
  const { user, setUser } = useAuth() || {};
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data.stats);
      if (setUser) {
        setUser(prevUser => ({
          ...prevUser,
          streak: res.data.streak,
          badges: res.data.badges,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stats || !user) return <div>No stats available</div>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <div>
        <h2>Your Stats</h2>
        <div>
          <h3>Current Streak</h3>
          <p>{user.streak} days</p>
        </div>
        <div>
          <h3>Total Fasts</h3>
          <p>{stats.totalFasts}</p>
        </div>
        <div>
          <h3>Longest Fast</h3>
          <p>{stats.longestFast} hours</p>
        </div>
      </div>
      <div>
        <h2>Badges</h2>
        {user.badges && user.badges.map((badge, index) => (
          <span key={index}>{badge}</span>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;