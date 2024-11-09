import React from 'react';

function HealthBenefits() {
  const benefits = [
    "May assist with weight management",
    "Potential improvements in insulin sensitivity",
    "Possible reduction in inflammation",
    "May support brain health",
    "May improve heart health",
    "Could promote longevity",
    "May enhance metabolic flexibility",
    "Can improve cellular repair processes (autophagy)",
    "May reduce oxidative stress",
    "Can support healthy aging",
    "May help with blood sugar control",
    "Might enhance hormone balance",
    "May improve mental clarity and concentration",
    "Can support gut health",
    "May contribute to reduced risk of chronic diseases",
    "May help reduce bad cholesterol levels",
    "Can improve mood and mental well-being",
  ];

  return (
    <div className="health-benefits">
      <h1>Potential Health Benefits of Fasting</h1>
      <p>Research suggests that intermittent fasting may offer several health benefits:</p>
      <ul>
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <p>Remember to consult with a healthcare professional before starting any new fasting regimen.</p>
    </div>
  );
}

export default HealthBenefits;
