'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

const imageUrls = [
  '/mediterranean cove.png',
  '/Midjourney_hiking in the Alps.png',
  '/Midjourney_kitesurfing.png',
  '/Midjourney_seniors at tennis court.png',
  '/Midjourney_seniors at the terrace.png',
  '/Midjourney_seniors running at the beach.png',
  '/Midjourney_skiing.png',
];

const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const images = useMemo(() => imageUrls, []);

  // Memoize the loadImage function
  const loadImage = useCallback((imagePath: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        setImageErrors((prev) => ({ ...prev, [imagePath]: true }));
        reject();
      };
      img.src = imagePath;
    });
  }, []);

  // Load images and handle errors
  useEffect(() => {
    Promise.all(images.map(loadImage))
      .then(() => console.log('All images loaded successfully'))
      .catch(() => console.error('Error loading one or more images'));
  }, [images, loadImage]);

  // Handle image transitions
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [images.length]); // Only depend on the length

  return (
    <>
      {/* Rest of the component remains the same */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100 animate-zoom' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${image}")`,
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

      <style jsx>{`
        @keyframes zoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .animate-zoom {
          animation: zoom 4s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default BackgroundSlideshow;