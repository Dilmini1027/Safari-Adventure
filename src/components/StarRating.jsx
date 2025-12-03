import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readOnly = false, 
  size = 'md',
  showCount = false,
  count = 0 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleMouseEnter = (star) => {
    if (!readOnly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (star) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(star);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-colors duration-150 ${
              readOnly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 transform transition-transform'
            }`}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            disabled={readOnly}
          >
            {star <= displayRating ? (
              <StarIcon 
                className={`${sizeClasses[size]} ${
                  readOnly 
                    ? 'text-yellow-400' 
                    : hoverRating >= star 
                      ? 'text-yellow-400' 
                      : rating >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                }`} 
              />
            ) : (
              <StarOutlineIcon 
                className={`${sizeClasses[size]} ${
                  readOnly 
                    ? 'text-gray-300' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`} 
              />
            )}
          </button>
        ))}
      </div>
      
      {showCount && (
        <span className="text-sm text-gray-500 ml-2">
          ({count} review{count !== 1 ? 's' : ''})
        </span>
      )}
      
      {!readOnly && (
        <span className="text-sm text-gray-600 ml-2">
          {hoverRating > 0 ? (
            <span className="font-medium">
              {hoverRating} star{hoverRating !== 1 ? 's' : ''}
            </span>
          ) : rating > 0 ? (
            <span>
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-gray-400">Click to rate</span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRating;