import React from 'react';
import useDarkMode from './components/hooks/useDarkMode'; // Dark mode state hook
import DarkModeToggle from './components/DarkModeToggle'; // Toggle button
import WelcomeSpotlightDemo from './pages/Landing'; // Landing page content

function App() {
    const [darkMode, setDarkMode] = useDarkMode(); // Use dark mode hook

    const toggleDarkMode = () => setDarkMode(!darkMode); // Toggle dark mode state

    return (
        <div
            className={`
                min-h-screen transition-colors duration-500 
                bg-customLight text-black 
                dark:bg-customDark dark:text-white
            `}
        >
            {/* Dark Mode Toggle */}
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Main Content */}
            <WelcomeSpotlightDemo />
        </div>
    );
}

export default App;