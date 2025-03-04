"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Users,
  Award,
  LogIn,
  UserPlus,
  MessageSquare,
  X,
  Send,
  Brain,
  Video,
  BarChart,
  Database,
  Lock,
  Menu,
  Quote,
} from "lucide-react"
import { Link } from "react-router-dom"
import Tilt from "react-parallax-tilt";




const ParallaxLanding = () => {
  const [activeSection, setActiveSection] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ type: "bot", text: "Hello! How can I help you today?" }])
  const [messageInput, setMessageInput] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const backgrounds = [
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(2)-g7As1tLGZQ8K6ojC79hhxAUk1DlMbf.jpeg",
      title: "Elimu Global",
      subtitle: "Through Innovation and Technology",
      overlay: "from-transparent to-transparent", // Remove colored overlay
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(2)-JklbVklnLM9v4hKWQnRrEZzdAVAqCS.jpeg",
      title: "Empower Learning",
      subtitle: "With Cutting-Edge Tools",
      overlay: "from-transparent to-transparent",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-cXAyha1SCXXoH1B5Lk4uwNj54vhu4G.jpeg",
      title: "Build Future",
      subtitle: "One Course at a Time",
      overlay: "from-transparent to-transparent",
    },
  ]

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
        "Basic course tools",
      ],
      color: "bg-blue-600",
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
        "AI-powered features",
      ],
      color: "bg-purple-600",
      popular: true,
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
        "Advanced AI features",
      ],
      color: "bg-indigo-600",
    },
  ]

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Tutoring",
      description: "Personalized learning assistance available 24/7",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Auto-Generated Captions",
      description: "Real-time captions for all video content",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Smart Certifications",
      description: "Blockchain-verified certificates with unique QR codes",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Predictive Analytics",
      description: "AI-driven insights on student performance",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Content Management",
      description: "Automated content organization and tagging",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Advanced Security",
      description: "AI-powered fraud detection and prevention",
    },
  ]

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Create Courses",
      description: "Build interactive courses with multimedia content",
    },
    { icon: <Users className="w-6 h-6" />, title: "Reach Students", description: "Connect with learners worldwide" },
    { icon: <Award className="w-6 h-6" />, title: "Earn Revenue", description: "Flexible revenue sharing model" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor(scrollPosition / windowHeight)
      setActiveSection(Math.min(section, backgrounds.length - 1))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((current) => (current + 1) % backgrounds.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const opacity = useTransform(scrollY, [0, 800], [1, 0])

  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    setChatMessages([...chatMessages, { type: "user", text: messageInput }])

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Thanks for your message! Our team will assist you shortly.",
        },
      ])
    }, 1000)

    setMessageInput("")
  }

  const testimonials = [
    {
      name: "John Doe",
      role: "Student",
      content: "Elimu Global has transformed my learning experience. The AI-powered features are incredible!",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Jane Smith",
      role: "Instructor",
      content: "As an educator, I've found Elimu Global to be an invaluable tool for reaching and engaging students.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Alex Johnson",
      role: "Parent",
      content:
        "My child's academic performance has improved significantly since using Elimu Global. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ]

  return (
    <div className="relative min-h-[300vh] overflow-hidden">
      {/* New Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                Elimu Global
              </Link>
            </div>
            <div className="hidden md:flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link
                to="/pricing"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link
                to="/instructorsform"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium ml-3"
              >
                Get Started
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/pricing"
                  className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/get-started"
                  className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {backgrounds.map((bg, index) => (
        <motion.div
          key={index}
          className="fixed inset-0 w-full h-screen bg-cover bg-center z-0 bg-white"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: activeSection === index ? 1 : 0,
            scale: activeSection === index ? 1 : 1.1,
          }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 1.5 },
          }}
          style={{
            backgroundImage: `url(${bg.image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${bg.overlay}`} />
        </motion.div>
      ))}

      <div className="relative z-10">
        <motion.section className="min-h-screen flex items-center justify-center relative" style={{ opacity }}>
          <Tilt className="Tilt" options={{ max: 25, scale: 1.05 }}>
            <div className="text-center text-blue-900 px-4 bg-white/90 py-8 rounded-lg backdrop-blur-sm Tilt-inner">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-6xl md:text-8xl font-black mb-4">{backgrounds[activeSection].title}</h1>
                <p className="text-xl md:text-2xl">{backgrounds[activeSection].subtitle}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-4 items-center"
              >
                <motion.a
                  href="/instructorsform"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center w-full sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Get Started
                </motion.a>
                <motion.a
                  href="/login"
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center w-full sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </motion.a>
              </motion.div>
            </div>
          </Tilt>
        </motion.section>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.section
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-bold text-center text-blue-900 mb-12">Our Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <motion.div
                    className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-blue-600"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16 text-white">
            <h2 className="text-5xl font-bold text-center mb-4">AI-Powered Learning</h2>
            <p className="text-xl text-center mb-12 text-blue-200">
              Experience the future of education with our cutting-edge AI features
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <motion.div
                    className="text-blue-400 mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* New Testimonial Section */}
        <motion.section
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-bold text-center text-blue-900 mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.2 + 0.3 }}
                  >
                    <Quote className="w-10 h-10 text-blue-600 mb-2" />
                    <p className="text-gray-600 italic">{testimonial.content}</p>
                  </motion.div>
                  <div className="flex items-center mt-4">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.2 + 0.5 }}
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col"
          >
            <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Chat Support</h3>
              <motion.button onClick={() => setIsChatOpen(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
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
                <motion.button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isChatOpen && (
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
      <style jsx global>{`
        .Tilt {
          transform-style: preserve-3d;
        }
        .Tilt-inner {
          transform: translateZ(20px);
        }
      `}</style>
    </div>
  )
}

export default ParallaxLanding

