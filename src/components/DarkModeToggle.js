import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Heroicons for dark/light icons

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
        <div className="fixed bottom-4 left-4 z-50">
            <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors duration-200 ${
                    darkMode
                        ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {darkMode ? (
                    <SunIcon className="h-6 w-6" /> // Sun icon for dark mode
                ) : (
                    <MoonIcon className="h-6 w-6" /> // Moon icon for light mode
                )}
            </button>
        </div>
    );
};

export default DarkModeToggle;