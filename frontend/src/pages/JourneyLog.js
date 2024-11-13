import React, { useEffect, useState, useCallback } from 'react';
import * as api from '../utils/api';
import { getUserFasts } from '../utils/api';

function JourneyLog() {
  const [fasts, setFasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFasts = useCallback(async () => {
    try {
      setLoading(true);
      const [fastsRes, journeysRes] = await Promise.all([
        api.getUserFasts(),
        api.getUserJourneys()
      ]);

      // Ensure data exists and is in array format
      const fastsData = Array.isArray(fastsRes?.data) ? fastsRes.data : [];
      const journeysData = Array.isArray(journeysRes?.data) ? journeysRes.data : [];

      if (fastsData.length === 0 && journeysData.length === 0) {
        setFasts([]);
        return;
      }

      // Merge and sync fasting data with journeys
      const mergedData = fastsData.map(fast => {
        const matchingJourney = journeysData.find(
          journey => new Date(journey.startTime).getTime() === new Date(fast.startTime).getTime()
        );
        return {
          ...fast,
          ...(matchingJourney || {}),
          _id: fast._id || matchingJourney?._id || `temp-${Date.now()}`
        };
      });

      setFasts(mergedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error?.message || 'Failed to fetch fasting data. Please try again later.');
      setFasts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFasts();

    // Set up real-time updates
    const updateInterval = setInterval(fetchFasts, 60000); // Update every minute
    return () => clearInterval(updateInterval);
  }, [fetchFasts]);

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return '0h 0m';
    
    const durationInMs = endTime ? 
      new Date(endTime) - new Date(startTime) : 
      Date.now() - new Date(startTime);
    
    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) return (
    <div className="journey-log-loading">
      <p>Loading your fasting journey...</p>
    </div>
  );

  if (error) return (
    <div className="journey-log-error">
      <p>Error: {error}</p>
      <button 
        onClick={fetchFasts}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="journey-log">
      <h2 className="journey-log-title">Fasting Journey</h2>
      {fasts.length === 0 ? (
        <p className="journey-log-empty">
          No fasts recorded yet. Start your first fast to see your journey!
        </p>
      ) : (
        <ul className="journey-log-list">
          {fasts.map((fast) => (
            <li key={fast._id} className="journey-log-item">
              <div className="journey-log-item-header">
                <span className="journey-log-item-date">
                  {fast.startTime ? new Date(fast.startTime).toLocaleDateString() : 'Invalid Date'}
                </span>
                <span className={`journey-log-item-status ${fast.status}`}>
                  {fast.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <div className="journey-log-item-details">
                <span className="journey-log-item-start">
                  Start: {fast.startTime ? new Date(fast.startTime).toLocaleTimeString() : 'N/A'}
                </span>
                {fast.endTime && (
                  <span className="journey-log-item-end">
                    End: {new Date(fast.endTime).toLocaleTimeString()}
                  </span>
                )}
                <span className="journey-log-item-target">
                  Target: {fast.targetHours || 0} hours
                </span>
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
