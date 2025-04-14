import { useEffect, useState } from 'react';

const useDarkMode = () => {
    // Initialize dark mode based on localStorage or system preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            return savedMode === 'true';
        }
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    useEffect(() => {
        // Update localStorage when mode changes
        localStorage.setItem('darkMode', isDarkMode);
        
        // Apply/remove dark class on body
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    return [isDarkMode, setIsDarkMode];
};

export default useDarkMode;