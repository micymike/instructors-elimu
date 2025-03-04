"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from "react"
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formState)
    // Reset form after submission
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to ="/" className="text-2xl font-bold text-blue-600">
                Elimu Global
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
            
            </div>
            <div className="hidden md:flex items-center">
              <Link to ="/" className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
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
                className="text-blue-600 hover:text-blue-800"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block text-blue-600 hover:text-blue-800 py-2">Home</Link>
              <Link href="/contact" className="block text-blue-600 hover:text-blue-800 py-2">Contact</Link>
              <Link href="/pricing" className="block text-blue-600 hover:text-blue-800 py-2">Pricing</Link>
              <Link href="/login" className="block text-blue-600 hover:text-blue-800 py-2">Login</Link>
              <Link href="/get-started" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Get In Touch</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-lg text-blue-800 mb-8">
                We're here to help you succeed. Reach out to us for any inquiries or support.
              </p>
              <motion.div className="flex items-center" whileHover={{ scale: 1.05, x: 10 }}>
                <Mail className="w-6 h-6 mr-4 text-blue-600" />
                <span className="text-blue-800">support@learning.com</span>
              </motion.div>
              <motion.div className="flex items-center" whileHover={{ scale: 1.05, x: 10 }}>
                <Phone className="w-6 h-6 mr-4 text-blue-600" />
                <span className="text-blue-800">+254 123 456 789</span>
              </motion.div>
              <motion.div className="flex items-center" whileHover={{ scale: 1.05, x: 10 }}>
                <MapPin className="w-6 h-6 mr-4 text-blue-600" />
                <span className="text-blue-800">Nairobi, Kenya</span>
              </motion.div>
            </motion.div>
            <motion.form
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <textarea
                name="message"
                value={formState.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
              <motion.button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all w-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.form>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Location</h2>
            <div className="w-full h-96 bg-blue-100 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19891888756!2d36.70730744863281!3d-1.3031933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}