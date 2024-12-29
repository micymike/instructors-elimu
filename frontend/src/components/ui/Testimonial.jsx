import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    content: "Teaching on this platform has been an incredible journey. The tools and support provided are exceptional.",
    author: "Dr. Sarah Johnson",
    role: "Mathematics Professor",
    avatar: "emi.avif"
  },
  {
    id: 2,
    content: "I've connected with students from around the world and made a real impact on their learning journey.",
    author: "Prof. Michael Chen",
    role: "Computer Science Instructor",
    avatar: "mike.avif"
  },
  {
    id: 3,
    content: "The platform's flexibility allows me to create engaging content and reach more students than ever before.",
    author: "Emma Rodriguez",
    role: "Language Expert",
    avatar: "teacher1.avif"
  }
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-500 opacity-90" />
      <div className="relative z-10 max-w-md mx-auto text-center px-4">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-white">
              <p className="text-xl italic font-light leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].author}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <p className="font-semibold">{testimonials[currentIndex].author}</p>
                <p className="text-sm opacity-80">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial; 