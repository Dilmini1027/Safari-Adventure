import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Array of background images to rotate through
  const heroImages = [
    "./Magnificent Elephant.jpeg",
    "./wildlife-safaris.jpeg",
    "./4da87f9128d61b15f6635e229207231f.jpg",
    "./d835275e79aae7b73d4623bde5237a4c.jpg",
    "./35 Examples of Inspirational Wildlife Photography….jpeg",
    "./Pictures Worth More Than 1000 Words (24 images).jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Preload images to ensure smooth transitions
  useEffect(() => {
    heroImages.forEach((imageSrc, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${imageSrc}`);
      };
      img.src = imageSrc;
    });
  }, [heroImages]);

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-screen bg-green-900 flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Left Side Background Image with Smooth Transition */}
      <div className="absolute left-0 top-0 w-1/2 h-full opacity-70">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex && loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url("${image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              backgroundRepeat: 'no-repeat'
            }}
            onError={(e) => {
              console.error(`Background image failed to load: ${image}`);
              e.target.style.backgroundImage = `url("./Magnificent Elephant.jpeg")`;
            }}
          />
        ))}
        {/* Optional overlay for better blending */}
        <div className="absolute inset-0 bg-green-900/30"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ECO Safari
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover breathtaking wildlife experiences and unforgettable adventures in the world's most spectacular destinations
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="btn btn-primary text-lg px-8 py-4">
            Start Your Journey
          </button>
          <button className="btn btn-secondary text-lg px-8 py-4">
            View Destinations
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;