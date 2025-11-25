import React from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  CameraIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Destinations",
      description: "Explore 50+ countries with expert local guides"
    },
    {
      icon: <CameraIcon className="w-8 h-8" />,
      title: "Photo Safaris",
      description: "Capture stunning wildlife moments with professional equipment"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Small Groups",
      description: "Intimate experiences with maximum 8 people per group"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Safety First",
      description: "100% safety record with comprehensive insurance coverage"
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "5-Star Service",
      description: "Luxury accommodations and world-class service"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance throughout your journey"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Safari Adventures?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide unparalleled safari experiences with attention to every detail
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready for Your Next Adventure?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied travelers who have experienced the trip of a lifetime with us.
          </p>
          <button className="btn btn-primary text-lg px-8 py-4">
            Book Your Safari Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;