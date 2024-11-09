import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { Clock, Flame, Activity, Heart, DropletIcon } from 'lucide-react';
import './FastingTimer.css';

const FASTING_STAGES = {
  INITIAL: {
    maxHours: 2,
    description: 'Blood sugar rises: Pancreas releases insulin',
    color: '#60A5FA',
    icon: '🌅'
  },
  EARLY: {
    maxHours: 5,
    description: 'Blood sugar falls: Using stored glucose',
    color: '#34D399',
    icon: '📉'
  },
  GLUCOSE_DEPLETION: {
    maxHours: 8,
    description: 'Blood sugar normal: Depleting glucose stores',
    color: '#FBBF24',
    icon: '⚡'
  },
  FAT_BURNING_INIT: {
    maxHours: 10,
    description: 'Fasting mode: Starting fat breakdown',
    color: '#F87171',
    icon: '🔥'
  },
  FAT_BURNING: {
    maxHours: 12,
    description: 'Fat burning mode: Primary energy source',
    color: '#EC4899',
    icon: '⚡'
  },
  KETOSIS: {
    maxHours: 18,
    description: 'Ketosis: Producing ketones for energy',
    color: '#8B5CF6',
    icon: '🎯'
  },
  DEEP_KETOSIS: {
    maxHours: Infinity,
    description: 'Deep ketosis: Maximum fat burning',
    color: '#6366F1',
    icon: '⭐'
  }
};

const PRESET_HOURS = [
  { value: 16, label: '16 Hours' },
  { value: 18, label: '18 Hours' },
  { value: 24, label: '24 Hours' },
  { value: 36, label: '36 Hours' },
  { value: 'custom', label: 'Custom' }
];

const FastingTimer = () => {
  // Added user preferences
  const [userPreferences, setUserPreferences] = useState(() => {
    const stored = localStorage.getItem('fastingPreferences');
    return stored ? JSON.parse(stored) : {
      targetHours: 16,
      customHours: '',
      lastStartTime: null
    };
  });

  const [fastState, setFastState] = useState({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    targetHours: userPreferences.targetHours,
    caloriesBurned: 0,
    currentStage: FASTING_STAGES.INITIAL
  });

  const [customHours, setCustomHours] = useState(userPreferences.customHours);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showTips, setShowTips] = useState(false);

  const circleRef = useRef(null);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const tipsRef = useRef(null);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('fastingPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Auto-sync time and handle past sessions
  useEffect(() => {
    const lastStartTime = userPreferences.lastStartTime;
    if (lastStartTime) {
      const now = Date.now();
      const elapsedTime = now - lastStartTime;
      const targetMs = (userPreferences.targetHours || 16) * 3600000;

      if (elapsedTime > 0 && elapsedTime < targetMs) {
        // Resume existing fast
        setFastState(prev => ({
          ...prev,
          isRunning: true,
          startTime: lastStartTime,
          elapsedTime,
          targetHours: userPreferences.targetHours
        }));
      } else if (elapsedTime >= targetMs) {
        // Clear completed fast
        setUserPreferences(prev => ({ ...prev, lastStartTime: null }));
      }
    }
  }, []);

  const formatTime = useCallback((ms) => {
    if (!ms || ms < 0) return '00:00:00';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const calculateProgress = useCallback(() => {
    if (!fastState.isRunning) return 0;
    const progress = (fastState.elapsedTime / (fastState.targetHours * 3600000)) * 100;
    return Math.min(Math.max(0, progress), 100); // Ensure progress stays between 0-100
  }, [fastState.elapsedTime, fastState.targetHours, fastState.isRunning]);

  const getCurrentStage = useCallback((elapsedHours) => {
    if (elapsedHours <= 0) return { ...FASTING_STAGES.INITIAL, name: 'INITIAL' };
    
    const stages = Object.entries(FASTING_STAGES);
    for (const [stage, data] of stages) {
      if (elapsedHours <= data.maxHours) {
        return { ...data, name: stage };
      }
    }
    return { ...FASTING_STAGES.DEEP_KETOSIS, name: 'DEEP_KETOSIS' };
  }, []);

  const calculateCalories = useCallback((elapsedMs) => {
    if (elapsedMs <= 0) return 0;
    const BASE_RATE = 2000;
    const FASTING_MULTIPLIER = 1.1;
    const hoursElapsed = elapsedMs / 3600000;
    return Math.max(0, Math.round((BASE_RATE * FASTING_MULTIPLIER / 24) * hoursElapsed));
  }, []);

  const animateProgress = useCallback(() => {
    const progress = calculateProgress();
    const duration = 1;

    gsap.to(progressRef.current, {
      strokeDashoffset: 283 - (283 * progress) / 100,
      duration,
      ease: 'power2.out'
    });

    gsap.to(circleRef.current, {
      rotation: progress * 3.6,
      duration,
      ease: 'power2.out'
    });
  }, [calculateProgress]);

  useEffect(() => {
    if (fastState.isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setFastState(prev => {
          const newElapsedTime = now - prev.startTime;
          
          // Check if fast is complete
          if (newElapsedTime >= prev.targetHours * 3600000) {
            clearInterval(timerRef.current);
            setUserPreferences(p => ({ ...p, lastStartTime: null }));
            return {
              ...prev,
              isRunning: false,
              elapsedTime: prev.targetHours * 3600000,
              caloriesBurned: calculateCalories(prev.targetHours * 3600000),
              currentStage: getCurrentStage(prev.targetHours)
            };
          }

          const elapsedHours = newElapsedTime / 3600000;
          return {
            ...prev,
            elapsedTime: newElapsedTime,
            caloriesBurned: calculateCalories(newElapsedTime),
            currentStage: getCurrentStage(elapsedHours)
          };
        });
        animateProgress();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fastState.isRunning, getCurrentStage, calculateCalories, animateProgress]);

  const handleStart = () => {
    const now = Date.now();
    const startTime = Math.max(now, selectedDateTime.getTime());

    // Update user preferences
    setUserPreferences(prev => ({
      ...prev,
      targetHours: customHours || fastState.targetHours,
      customHours,
      lastStartTime: startTime
    }));

    setFastState(prev => ({
      ...prev,
      isRunning: true,
      startTime,
      elapsedTime: 0,
      targetHours: customHours || prev.targetHours,
      currentStage: FASTING_STAGES.INITIAL
    }));

    gsap.from(circleRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out'
    });
  };

  const handleStop = () => {
    if (!window.confirm('Are you sure you want to end your fast?')) return;

    // Clear user preferences
    setUserPreferences(prev => ({ ...prev, lastStartTime: null }));

    setFastState(prev => ({
      ...prev,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      caloriesBurned: 0,
      currentStage: FASTING_STAGES.INITIAL
    }));

    gsap.to(circleRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.in',
      onComplete: () => {
        gsap.set(circleRef.current, { scale: 1, opacity: 1 });
        gsap.set(progressRef.current, { strokeDashoffset: 283 });
      }
    });
  };

  const handleTargetHoursChange = (value) => {
    setFastState(prev => ({
      ...prev,
      targetHours: value
    }));
    setUserPreferences(prev => ({
      ...prev,
      targetHours: value
    }));
  };

  const toggleTips = () => {
    setShowTips(prev => !prev);
    
    gsap.to(tipsRef.current, {
      height: showTips ? 0 : 'auto',
      duration: 0.5,
      ease: 'power2.inOut'
    });
  };

  // Ensure selectedDateTime is never in the past
  useEffect(() => {
    const now = new Date();
    if (selectedDateTime < now) {
      setSelectedDateTime(now);
    }
  }, [selectedDateTime]);

  return (
    <div className="fasting-timer">
      <div className="timer-container">
        <div className="progress-ring" ref={circleRef}>
          <svg viewBox="0 0 100 100">
            <circle className="progress-ring__circle-bg" cx="50" cy="50" r="45" />
            <circle 
              ref={progressRef}
              className="progress-ring__circle" 
              cx="50" 
              cy="50" 
              r="45"
              style={{ stroke: fastState.currentStage.color }}
            />
          </svg>
          <div className="timer-display">
            <span className="timer-time">{formatTime(fastState.elapsedTime)}</span>
            <span className="timer-target">{fastState.targetHours}h Target</span>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <Flame className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{fastState.caloriesBurned}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <Activity className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{Math.min(100, Math.round(calculateProgress()))}%</span>
            </div>
          </div>
        </div>

        <div className="stage-info">
          <div className="stage-header">
            <span className="stage-icon">{fastState.currentStage.icon}</span>
            <span className="stage-name">{fastState.currentStage.name}</span>
          </div>
          <p className="stage-description">{fastState.currentStage.description}</p>
        </div>

        <div className="controls">
          {!fastState.isRunning ? (
            <button className="control-button start" onClick={handleStart}>
              <Clock className="button-icon" />
              Start Fast
            </button>
          ) : (
            <button className="control-button stop" onClick={handleStop}>
              <Activity className="button-icon" />
              End Fast
            </button>
          )}

          <select 
            className="hours-select"
            value={fastState.targetHours}
            onChange={(e) => handleTargetHoursChange(e.target.value)}
            disabled={fastState.isRunning}
          >
            {PRESET_HOURS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {fastState.targetHours === 'custom' && (
            <input
              type="number"
              className="custom-hours"
              value={customHours}
              onChange={(e) => {
                const value = Math.min(Math.max(1, e.target.value), 72);
                setCustomHours(value);
                setUserPreferences(prev => ({ ...prev, customHours: value }));
              }}
              placeholder="Custom hours (1-72)"
              min="1"
              max="72"
              disabled={fastState.isRunning}
            />
          )}

          <input
            type="datetime-local"
            className="datetime-picker"
            value={selectedDateTime.toISOString().slice(0, 16)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (newDate >= new Date()) {
                setSelectedDateTime(newDate);
              }
            }}
            min={new Date().toISOString().slice(0, 16)}
            disabled={fastState.isRunning}
          />
        </div>

        <div className="tips-section">
          <button className="tips-toggle" onClick={toggleTips}>
            <DropletIcon className="tips-icon" />
            Fasting Tips
          </button>
          <div className="tips-content" ref={tipsRef}>
            <ul>
              <li>Stay hydrated with water and electrolytes</li>
              <li>Keep yourself busy with activities</li>
              <li>Get adequate sleep and rest</li>
              <li>Avoid looking at food content</li>
              <li>Practice mindfulness or meditation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastingTimer;