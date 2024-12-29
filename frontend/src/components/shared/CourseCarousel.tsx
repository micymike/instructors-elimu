import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { wrap } from 'popmotion';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

interface CourseCarouselProps {
  courses: Course[];
  onSelect: (course: Course) => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const CourseCarousel: React.FC<CourseCarouselProps> = ({ courses, onSelect }) => {
  const [[page, direction], setPage] = React.useState([0, 0]);
  const courseIndex = wrap(0, courses.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="absolute left-4 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
          onClick={() => paginate(-1)}
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-[80%] max-w-3xl cursor-grab active:cursor-grabbing"
          >
            <div 
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              onClick={() => onSelect(courses[courseIndex])}
            >
              {courses[courseIndex].thumbnail && (
                <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
                  <img
                    src={courses[courseIndex].thumbnail}
                    alt={courses[courseIndex].title}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {courses[courseIndex].title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {courses[courseIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className="absolute right-4 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
          onClick={() => paginate(1)}
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {courses.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              i === courseIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            onClick={() => setPage([i, i > courseIndex ? 1 : -1])}
          />
        ))}
      </div>
    </div>
  );
};
