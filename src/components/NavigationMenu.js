import React from 'react';

const NavigationMenu = ({ darkMode }) => {
  const menuItems = [
    { name: 'WORKS', href: '#works' },
    { name: 'BLOG', href: '#blog' },
    { name: 'ABOUT ME', href: '#about' },
  ];

  return (
    <nav className="fixed top-6 right-6 z-50 flex space-x-8">
      {/* Map over the menu items */}
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={`relative text-lg font-medium transition duration-300 ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {item.name}
          {/* Glowing underline animation */}
          <span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-current scale-x-0 transform transition-transform duration-300 origin-center group-hover:scale-x-100"
          ></span>
        </a>
      ))}
    </nav>
  );
};

export default NavigationMenu;