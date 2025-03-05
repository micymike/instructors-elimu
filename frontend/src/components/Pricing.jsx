"use client"

import { motion } from "framer-motion"
import { Check, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom";


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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-600 hover:text-blue-800">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/contact" className="block text-blue-600 hover:text-blue-800 py-2">
                Contact
              </Link>
              <Link href="/pricing" className="block text-blue-600 hover:text-blue-800 py-2">
                Pricing
              </Link>
              <Link href="/login" className="block text-blue-600 hover:text-blue-800 py-2">
                Login
              </Link>
              <Link
                href="/get-started"
                className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="py-16 pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Pricing Plans</h1>
          <p className="text-xl text-center mb-12 text-blue-600">Choose the perfect plan for your needs</p>

          {/* Cool Feature: Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-200 p-1 rounded-full">
              <button
                className={`px-4 py-2 rounded-full ${billingCycle === "monthly" ? "bg-white text-blue-600" : "text-blue-600"}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full ${billingCycle === "annual" ? "bg-white text-blue-600" : "text-blue-600"}`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative rounded-2xl shadow-xl overflow-hidden ${plan.popular ? "transform scale-105" : ""}`}
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
                    <span className="text-4xl font-bold mx-1">
                      {billingCycle === "annual"
                        ? (Number.parseInt(plan.price.replace(",", "")) * 10).toLocaleString()
                        : plan.price}
                    </span>
                    <span className="text-sm opacity-80">{billingCycle === "annual" ? "per year" : plan.period}</span>
                  </div>
                  {billingCycle === "annual" && <p className="text-sm mt-2">Save 17% with annual billing</p>}
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <motion.li
                        key={fIndex}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: fIndex * 0.1 }}
                      >
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    className={`w-full mt-6 px-6 py-3 rounded-lg text-white ${plan.color} hover:opacity-90 transition-opacity`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cool Feature: FAQ Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time." },
                { q: "Is there a free trial?", a: "We offer a 14-day free trial for all our plans." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards and PayPal." },
                {
                  q: "Can I cancel my subscription?",
                  a: "You can cancel your subscription at any time with no penalties.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-blue-900">{faq.q}</h3>
                  <p className="text-blue-700 mt-2">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

