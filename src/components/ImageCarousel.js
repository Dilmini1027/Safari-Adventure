import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDestinations } from '../contexts/DestinationContext';

// Add CSS animation to document head
if (typeof window !== 'undefined' && !document.getElementById('carousel-styles')) {
  const style = document.createElement('style');
  style.id = 'carousel-styles';
  style.textContent = `
    @keyframes infiniteScroll {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }
  `;
  document.head.appendChild(style);
}

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const { destinations, loading } = useDestinations();

  // Use actual destinations data
  const safariImages = destinations.map(dest => ({
    id: dest.id,
    src: dest.image,
    title: dest.name,
    description: dest.description,
    location: dest.location,
    price: `Rs ${dest.price.toLocaleString()}`
  }));

  // Show loading state if destinations are not loaded yet
  if (loading || safariImages.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading destinations...</p>
          </div>
        </div>
      </section>
    );
  }

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

          {/* Infinite Flowing Images Container */}
          <div className="relative h-96 overflow-hidden">
            <div 
              className="flex gap-6"
              style={{
                width: `${safariImages.length * 2 * 320}px`, // Double width for seamless loop
                animation: `infiniteScroll ${safariImages.length * 4}s linear infinite`,
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            >
              {/* First set of images */}
              {safariImages.map((image, index) => (
                <div
                  key={`first-${image.id}`}
                  className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer relative group"
                >
                  <img 
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-gray-200 mb-3">{image.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{image.location}</span>
                      <span className="text-lg font-bold text-yellow-400">{image.price}</span>
                    </div>
                  </div>

                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {safariImages.map((image, index) => (
                <div
                  key={`second-${image.id}`}
                  className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer relative group"
                >
                  <img 
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-gray-200 mb-3">{image.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{image.location}</span>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;