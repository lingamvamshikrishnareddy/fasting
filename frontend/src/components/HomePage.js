import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Sun, Users, Book } from 'lucide-react';
import AuthModal from './AuthModal';
import './Homepage.css';

// Constants
const FEATURES = [
  {
    icon: <Sun className="w-8 h-8" />,
    title: "Personalized Fasting Plans",
    description: "AI-powered fasting protocols tailored to your unique body type and lifestyle"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Guided Yoga Sessions",
    description: "Expert-led yoga practices for all skill levels, from beginners to advanced"
  },
  {
    icon: <Book className="w-8 h-8" />,
    title: "Nutritional Guidance",
    description: "Customized meal plans and expert nutrition advice to support your wellness journey"
  }
];

const STEPS = [
  { number: "01", title: "Sign Up", description: "Create your account and tell us about your wellness aspirations" },
  { number: "02", title: "Get Your Plan", description: "Receive a personalized fasting and wellness plan tailored just for you" },
  { number: "03", title: "Track Progress", description: "Log your activities and monitor your improvements with our intuitive tools" },
  { number: "04", title: "Achieve Results", description: "Reach your wellness goals with our ongoing support and community" }
];

const FAQS = [
  {
    question: "What is intermittent fasting?",
    answer: "Intermittent fasting is an eating pattern that cycles between periods of fasting and eating, promoting various health benefits."
  },
  {
    question: "Is yoga suitable for beginners?",
    answer: "Absolutely! Our yoga programs cater to all levels, including complete beginners, ensuring a safe and enjoyable experience."
  },
  {
    question: "How often should I practice yoga?",
    answer: "We recommend starting with 2-3 sessions per week and increasing frequency as you progress."
  },
  {
    question: "Can I customize my fasting schedule?",
    answer: "Yes! Our app allows you to customize your fasting schedule based on your lifestyle and goals."
  }
];

const HomePage = () => {
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState({ isOpen: false, type: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAuthSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setShowModal({ isOpen: false, type: null });
    navigate('/dashboard');
  };

  const AuthButtons = () => (
    <div className="auth-buttons">
      {isAuthenticated ? (
        <>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">Fastinjoy</Link>
          <AuthButtons variant="header" />
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showModal.isOpen}
        type={showModal.type}
        onClose={() => setShowModal({ isOpen: false, type: null })}
        onSuccess={handleAuthSuccess}
      />
     
     {/* Hero Section */}
     <section className="hero">
        <div className="container">
          <h1>Welcome to Fastinjoy</h1>
          <p>Your personal fasting, yoga, and wellness companion</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary hero-cta">
              Get Started Now
            </Link>
          )}
        </div>
      </section>
    

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Transform Your Life With Our Features</h2>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            {STEPS.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question" 
                  onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className={`faq-icon ${activeFaqIndex === index ? 'rotate' : ''}`} />
                </button>
                {activeFaqIndex === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Start Your Wellness Journey Today</h2>
          <p>Join thousands of satisfied users and transform your life with Fastinjoy</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary">
              Get Started Now
            </Link>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>Fastinjoy is your comprehensive wellness platform, combining the power of intermittent fasting, yoga, and mindful nutrition.</p>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} Fastinjoy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
