import React from 'react';

export const Carousel = ({ children }) => {
  return <div className="relative overflow-hidden">{children}</div>;
};

export const CarouselContent = ({ children }) => {
  return <div className="flex">{children}</div>;
};

export const CarouselItem = ({ children }) => {
  return <div className="flex-shrink-0 w-full">{children}</div>;
};

export const CarouselNext = ({ onClick }) => {
  return <button onClick={onClick} className="absolute right-0">Next</button>;
};

export const CarouselPrev = ({ onClick }) => {
  return <button onClick={onClick} className="absolute left-0">Previous</button>;
};
