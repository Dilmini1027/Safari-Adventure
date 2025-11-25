import React from 'react';
import Hero from '../components/Hero';
import ImageCarousel from '../components/ImageCarousel';
import Features from '../components/Features';
import NavBar from '../components/MobileNavBar';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <ImageCarousel />
      <Features />
    </div>
  );
};

export default HomePage;