import React, { useEffect, useState } from 'react';
import * as api from '../utils/api';

function JourneyLog() {
  const [fasts, setFasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFasts();
  }, []);

  const fetchFasts = async () => {
    try {
      setLoading(true);
      const res = await api.getUserFasts();
      console.log('API response:', res);
      if (res && res.data) {
        // Adjust this condition based on your actual API response structure
        setFasts(Array.isArray(res.data) ? res.data : res.data.data || []);
        setError(null);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching fasts:', error);
      setError('Failed to fetch fasts. Please try again later.');
      setFasts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (startTime, endTime) => {
    const durationInMs = endTime ? new Date(endTime) - new Date(startTime) : Date.now() - new Date(startTime);
    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <div className="journey-log-loading">Loading...</div>;
  if (error) return <div className="journey-log-error">{error}</div>;

  return (
    <div className="journey-log">
      <h2 className="journey-log-title">Fasting Journey</h2>
      {fasts.length === 0 ? (
        <p className="journey-log-empty">No fasts recorded yet. Start your first fast to see your journey!</p>
      ) : (
        <ul className="journey-log-list">
          {fasts.map((fast) => (
            <li key={fast._id} className="journey-log-item">
              <div className="journey-log-item-header">
                <span className="journey-log-item-date">{new Date(fast.startTime).toLocaleDateString()}</span>
                <span className={`journey-log-item-status ${fast.endTime ? 'completed' : 'in-progress'}`}>
                  {fast.endTime ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <div className="journey-log-item-details">
                <span className="journey-log-item-start">Start: {new Date(fast.startTime).toLocaleTimeString()}</span>
                {fast.endTime && (
                  <span className="journey-log-item-end">End: {new Date(fast.endTime).toLocaleTimeString()}</span>
                )}
                <span className="journey-log-item-target">Target: {fast.targetHours} hours</span>
                <span className="journey-log-item-duration">
                  Duration: {formatDuration(fast.startTime, fast.endTime)}
                </span>
              </div>
              {fast.notes && <p className="journey-log-item-notes">{fast.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JourneyLog;