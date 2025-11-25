import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const safariImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
      title: "African Safari",
      description: "Experience the Big Five in their natural habitat",
      location: "Kenya & Tanzania",
      price: "$2,499"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=400&fit=crop",
      title: "Mountain Adventure",
      description: "Trek through breathtaking mountain landscapes", 
      location: "Nepal & Tibet",
      price: "$1,899"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      title: "Ocean Safari",
      description: "Dive into crystal-clear waters with marine life",
      location: "Maldives & Fiji",
      price: "$3,299"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
      title: "Desert Expedition",
      description: "Journey through golden sand dunes and oases",
      location: "Morocco & Dubai",
      price: "$1,699"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      title: "Forest Discovery",
      description: "Explore lush rainforests and exotic wildlife",
      location: "Costa Rica & Brazil",
      price: "$2,199"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      title: "Arctic Adventure",
      description: "Witness the aurora and polar wildlife",
      location: "Iceland & Norway",
      price: "$2,899"
    }
  ];

  const slideLeft = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? safariImages.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === safariImages.length - 1 ? 0 : prev + 1));
  };

  const getVisibleImages = () => {
    const visibleCount = 5; // Show more cards for the stacked effect
    const visible = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % safariImages.length;
      visible.push({
        ...safariImages[index],
        position: i
      });
    }
    return visible;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked safari experiences that will create memories to last a lifetime
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={slideLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={slideRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>

          {/* Images Container with 3D Perspective */}
          <div className="flex justify-center items-center relative h-96 overflow-visible" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="popLayout">
              {getVisibleImages().map((image, index) => {
                const position = image.position;
                const isCenter = position === 0;
                const zIndex = 50 - position * 10;
                const baseWidth = 300;
                const baseHeight = 380;
                
                return (
                  <motion.div
                    key={`${currentIndex}-${image.id}`}
                    className={`absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer`}
                    style={{
                      width: `${baseWidth - position * 20}px`,
                      height: `${baseHeight - position * 25}px`,
                      transformStyle: 'preserve-3d',
                      zIndex: zIndex,
                    }}
                    initial={{ 
                      x: direction > 0 ? 500 : -500,
                      scale: 0.7,
                      opacity: 0,
                      rotateY: direction > 0 ? 30 : -30,
                    }}
                    animate={{ 
                      x: position * 60,
                      y: position * 15,
                      scale: 1 - position * 0.1,
                      opacity: position < 4 ? 1 - position * 0.15 : 0,
                      rotateY: position * -8,
                      rotateX: position * 3,
                      z: -position * 40,
                    }}
                    exit={{ 
                      x: direction > 0 ? -500 : 500,
                      scale: 0.7,
                      opacity: 0,
                      rotateY: direction > 0 ? -30 : 30,
                    }}
                    transition={{ 
                      duration: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 150,
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: isCenter ? 1.05 : 1 - position * 0.08,
                      y: isCenter ? -15 : position * 10,
                      rotateY: isCenter ? 2 : position * -6,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="relative w-full h-full group">
                    <img 
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                      <p className="text-sm text-gray-200 mb-2">{image.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">{image.location}</span>
                        <span className="text-lg font-bold text-yellow-400">{image.price}</span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        View Details
                      </button>
                    </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-12">
            {safariImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;