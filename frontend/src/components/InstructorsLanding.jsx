import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, Users, Award, Mail, Phone, MapPin, ChevronRight, LogIn, 
  UserPlus, MessageSquare, X, Send, Brain, Video, 
  BarChart, Database, Lock
} from 'lucide-react';

const ParallaxLanding = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const { scrollY } = useScroll();
  const pricingPlans = [
    {
      name: "Basic",
      price: "2,999",
      period: "per month",
      features: [
        "5 courses upload limit",
        "Basic analytics",
        "Email support",
        "Standard video quality",
        "Basic course tools"
      ],
      color: "bg-blue-600"
    },
    {
      name: "Professional",
      price: "5,999",
      period: "per month",
      features: [
        "Unlimited courses",
        "Advanced analytics",
        "24/7 Priority support",
        "HD video quality",
        "Advanced course tools",
        "AI-powered features"
      ],
      color: "bg-purple-600",
      popular: true
    },
    {
      name: "Enterprise",
      price: "9,999",
      period: "per month",
      features: [
        "Custom solutions",
        "Dedicated support",
        "White-label option",
        "4K video quality",
        "Custom integrations",
        "Advanced AI features"
      ],
      color: "bg-indigo-600"
    }
  ];

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Tutoring",
      description: "Personalized learning assistance available 24/7"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Auto-Generated Captions",
      description: "Real-time captions for all video content"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Smart Certifications",
      description: "Blockchain-verified certificates with unique QR codes"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Predictive Analytics",
      description: "AI-driven insights on student performance"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Content Management",
      description: "Automated content organization and tagging"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Advanced Security",
      description: "AI-powered fraud detection and prevention"
    }
  ];

  const AnimatedTitle = ({ text, isFirstSlide }) => {
    // Animation variants for the container
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };
  
    // Animation variants for each letter
    const letterVariants = {
      hidden: { 
        y: 100,
        opacity: 0,
        rotateX: -90
      },
      visible: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100
        }
      }
    };
  
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative ${isFirstSlide ? 'scale-150 mt-[-10%]' : ''}`}
      >
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className={`inline-block ${
              isFirstSlide
                ? 'text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600'
                : 'text-4xl font-bold text-white'
            }`}
            style={{
              textShadow: isFirstSlide
                ? '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)'
                : 'none',
              transform: `translateZ(${isFirstSlide ? '20px' : '0'})`,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  const backgrounds = [
    {
      image: "landing.jpg",
      title: "Elimu Global",
      subtitle: "Through Innovation and Technology"
    },
    {
      image: "blackstudent.jpg",
      title: "Empower Learning",
      subtitle: "With Cutting-Edge Tools"
    },
    {
      image: "idea.jpg",
      title: "Build Future",
      subtitle: "One Course at a Time"
    },
    {
      image: "student.jpg",
      title: "Unlock Potential",
      subtitle: "With Personalized Learning"
    }

  ];

  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: "Create Courses", description: "Build interactive courses with multimedia content" },
    { icon: <Users className="w-6 h-6" />, title: "Reach Students", description: "Connect with learners worldwide" },
    { icon: <Award className="w-6 h-6" />, title: "Earn Revenue", description: "Flexible revenue sharing model" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const section = Math.floor(scrollPosition / windowHeight);
      setActiveSection(Math.min(section, backgrounds.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = useTransform(
    scrollY,
    [0, 800],
    [1, 0]
  );
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { type: 'user', text: messageInput }
    ]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        text: "Thanks for your message! Our team will assist you shortly."
      }]);
    }, 1000);
    
    setMessageInput('');
  };

  return (
    <div className="relative min-h-[300vh]">
      {/* Fixed Background Images */}
      {backgrounds.map((bg, index) => (
        <motion.div
          key={index}
          className="fixed inset-0 w-full h-screen bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${bg.image})`,
            opacity: activeSection === index ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <div className="absolute inset-0 bg-blue-900/60" />
        </motion.div>
      ))}

      {/* Scrolling Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex items-center justify-center relative"
          style={{ opacity }}
        >
          <div className="text-center text-white px-4">
            <motion.h1 className="text-6xl font-bold text-center animate-bounce" style={{ animation: 'fadeIn 2s forwards, bounce 1s 2s forwards' }}>{backgrounds[0].title}</motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl mb-8"
            >
              {backgrounds[0].subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <a href="/instructorsform" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Get Started
              </a>
              <a href="/login" className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="min-h-screen flex items-center justify-center bg-white/90 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16 text-white">
            <h2 className="text-4xl font-bold text-center mb-12">Get In Touch</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4" />
                  <span>support@learning.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4" />
                  <span>+254 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4" />
                  <span>Nairobi, Kenya</span>
                </div>
              </motion.div>
              <motion.form
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20"
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all w-full">
                  Send Message
                </button>
              </motion.form>
            </div>
          </div>
        </motion.section>
        {/* AI Features Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black backdrop-blur-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 text-white">
          <h2 className="text-4xl font-bold text-center mb-4">AI-Powered Learning</h2>
          <p className="text-xl text-center mb-12 text-blue-200">Experience the future of education with our cutting-edge AI features</p>
          <div className="grid md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center bg-white/95 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">Pricing Plans</h2>
          <p className="text-xl text-center mb-12 text-blue-600">Choose the perfect plan for your needs</p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className={`${plan.color} p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-lg">KSH</span>
                    <span className="text-4xl font-bold mx-1">{plan.price}</span>
                    <span className="text-sm opacity-80">{plan.period}</span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full mt-6 px-6 py-3 rounded-lg text-white ${plan.color} hover:opacity-90 transition-opacity`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
            {/* Chatbot */}
            <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col"
          >
            <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Chat Support</h3>
              <button onClick={() => setIsChatOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

</div>

    </div>
  );
};

  


export default ParallaxLanding;