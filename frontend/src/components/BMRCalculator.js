import React, { useState } from 'react';

function BMRCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [bmr, setBMR] = useState(null);

  const calculateBMR = (e) => {
    e.preventDefault();
    let result;
    if (gender === 'male') {
      result = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      result = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    setBMR(Math.round(result));
  };

  return (
    <div className="bmr-calculator">
      <h2>BMR Calculator</h2>
      <form onSubmit={calculateBMR}>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          required
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height (cm)"
          required
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit">Calculate BMR</button>
      </form>
      {bmr && (
        <div className="result">
          <h3>Your BMR:</h3>
          <p>{bmr} calories/day</p>
        </div>
      )}
    </div>
  );
}

export default BMRCalculator;