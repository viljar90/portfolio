import React, { useEffect, useRef } from 'react';

const QuizStartPage = ({ darkMode }) => {
  const containerRef = useRef(null);

  // Handle mouse movement (only remaining if you decide to add usage later)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // Dummy calculation
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // Dummy calculation
        // Mouse position processing logic can go here if needed later.
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
      ref={containerRef}
    >
      {/* Content */}
      <div className="text-center">
        <p className="text-lg mb-8">Who are you?</p>
        {/* Add quiz content or logic here */}
      </div>
    </div>
  );
};

export default QuizStartPage;