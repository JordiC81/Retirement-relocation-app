'use client';

import React, { useState, useEffect } from 'react';

const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const images = [
    "/Midjourney_bathing in the beach.png",
    "/Midjourney_hiking in the Alps.png",
    "/Midjourney_kitesurfing.png",
    "/Midjourney_seniors at tennis court.png",
    "/Midjourney_seniors at the terrace.png",
    "/Midjourney_seniors running at the beach.png",
    "/Midjourney_skiing.png"
  ];

  // Test image loading
  useEffect(() => {
    const testImages = [...images]; // Create a copy to avoid the dependency warning
    testImages.forEach(imagePath => {
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded: ${imagePath}`);
      };
      img.onerror = () => {
        console.error(`Failed to load: ${imagePath}`);
        setImageErrors(prev => ({ ...prev, [imagePath]: true }));
      };
      img.src = imagePath;
    });
  }, [images]); // Add images as dependency

  // Handle image transitions
  useEffect(() => {
    const imageCount = images.length; // Store length in a variable
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
        setIsTransitioning(false);
      }, 1000);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [images.length]); // Add images.length as dependency

  return (
    <>
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-1000 ${
                isTransitioning ? 'scale-110' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url("${image}")`,
                animation: currentImageIndex === index ? 'zoom 4s ease-out forwards' : 'none'
              }}
            />
            {Object.prototype.hasOwnProperty.call(imageErrors, image) && imageErrors[image] && (
              <div className="absolute top-0 left-0 bg-red-500 text-white p-2">
                Failed to load: {image}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Existing styles */}
      <style jsx>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default BackgroundSlideshow;