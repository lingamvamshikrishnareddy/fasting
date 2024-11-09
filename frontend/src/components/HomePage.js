import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sun, Moon, Users, Calendar, Book, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleFaq = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };

  const faqs = [
    {
      question: "What is intermittent fasting?",
      answer: "Intermittent fasting is an eating pattern that cycles between periods of fasting and eating. It focuses on when you eat rather than what you eat, promoting various health benefits including weight management and improved metabolic health."
    },
    {
      question: "Is yoga suitable for beginners?",
      answer: "Absolutely! Our yoga programs cater to all levels, including complete beginners. We offer guided sessions that gradually introduce you to different poses and techniques, ensuring a safe and enjoyable experience."
    },
    {
      question: "How often should I practice yoga?",
      answer: "For beginners, we recommend starting with 2-3 sessions per week. As you build strength and flexibility, you can increase the frequency based on your personal goals and schedule. Consistency is key to seeing results."
    },
    {
      question: "Can I customize my fasting schedule?",
      answer: "Yes! Our app allows you to customize your fasting schedule based on your lifestyle, preferences, and goals. We provide guidance to help you find the best approach for you, ensuring it fits seamlessly into your daily routine."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-purple-700">Fastinjoy</Link>
            <div className="flex gap-4">
              <Link to="/login" className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">Login</Link>
              <Link to="/register" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-r from-purple-700 to-indigo-700">
        <div className="absolute inset-0 opacity-20">
          <img src="/api/placeholder/1920/1080" alt="background" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white">
              Welcome to Fastinjoy
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-200">
              Your personal fasting, yoga, and wellness companion for a healthier, happier you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-purple-700 font-semibold hover:bg-gray-100 transition-colors">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Transform Your Life With Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sun className="w-8 h-8 text-purple-600" />,
                title: "Personalized Fasting Plans",
                description: "AI-powered fasting protocols tailored to your unique body type and lifestyle"
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Guided Yoga Sessions",
                description: "Expert-led yoga practices for all skill levels, from beginners to advanced"
              },
              {
                icon: <Book className="w-8 h-8 text-purple-600" />,
                title: "Nutritional Guidance",
                description: "Customized meal plans and expert nutrition advice to support your wellness journey"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Sign Up", description: "Create your account and tell us about your wellness aspirations" },
              { number: "02", title: "Get Your Plan", description: "Receive a personalized fasting and wellness plan tailored just for you" },
              { number: "03", title: "Track Progress", description: "Log your activities and monitor your improvements with our intuitive tools" },
              { number: "04", title: "Achieve Results", description: "Reach your wellness goals with our ongoing support and community" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen === index ? 'rotate-180' : ''}`} />
                </button>
                {isOpen === index && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and transform your life with Fastinjoy. Experience the perfect blend of fasting, yoga, and nutrition guidance.
          </p>
          <Link to="/register" className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-purple-700 font-semibold hover:bg-gray-100 transition-colors">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">Fastinjoy is your comprehensive wellness platform, combining the power of intermittent fasting, yoga, and mindful nutrition for optimal health.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Email: contact@fastinjoy.com</li>
                <li>Phone: +1 (123) 456-7890</li>
                <li>Address: 123 Wellness Street</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Fastinjoy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;