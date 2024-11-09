import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WeightTracker()  {
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const res = await api.get('/weights/user');
      setWeights(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('Error fetching weights:', error);
    }
  };

  const addWeight = async (e) => {
    e.preventDefault();
    try {
      await api.post('/weights/add', { weight: parseFloat(newWeight), date: newDate });
      fetchWeights();
      setNewWeight('');
      setNewDate('');
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const data = {
    labels: weights.map(w => new Date(w.date).toLocaleDateString()),
    datasets: [{
      label: 'Weight (kg)',
      data: weights.map(w => w.weight),
      borderColor: '#3498db',
      backgroundColor: '#3498db',
      fill: false
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="weight-tracker">
      <h2>Weight Progress</h2>
      <Line data={data} options={options} />
      <form onSubmit={addWeight} className="weight-form">
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Weight (kg)"
          step="0.1"
          required
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          required
        />
        <button type="submit">Add Weight</button>
      </form>
    </div>
  );
}

export default WeightTracker;