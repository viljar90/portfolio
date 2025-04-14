import React, { useEffect, useState } from 'react';

const CustomCursor = ({ scale = 1 }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    
    // Increase the base scale by 30% to make everything larger
    const enhancedScale = scale * 1.3;
    
    // Update cursor position based on mouse movement
    useEffect(() => {
        let animationFrameId;
        const handleMouseMove = (e) => {
            animationFrameId = window.requestAnimationFrame(() => {
                // Store the raw cursor position without any offsets
                setMousePos({
                    x: e.clientX,
                    y: e.clientY
                });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Detect hovering over interactive elements
    useEffect(() => {
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        const interactiveElements = document.querySelectorAll('a, button');
        
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
        
        return () => {
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    // Constants for glow effects
    const glowIntensity = isHovering ? 1.3 : 1; // Increase intensity on hover
    
    // Browser cursor hotspot is typically at the top-left corner of the arrow
    // We want our light effect to be centered on the hotspot (roughly where the pointer tip is)
    const hotspotOffsetX = 3;
    const hotspotOffsetY = 3;

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{
                left: mousePos.x - hotspotOffsetX,
                top: mousePos.y - hotspotOffsetY,
                // No transforms here to maintain exact positioning
            }}
        >
            {/* Outer glow - largest, most diffuse light */}
            <div
                className="absolute"
                style={{
                    width: `${90 * enhancedScale}px`,  // Increased from 70 to 90
                    height: `${90 * enhancedScale}px`,
                    marginLeft: `-${45 * enhancedScale}px`,
                    marginTop: `-${45 * enhancedScale}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    boxShadow: `0 0 ${60 * enhancedScale}px ${35 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 0.12)`,
                    transition: 'all 0.3s ease',
                }}
            />

            {/* Main outer glow with animation */}
            <div
                className="absolute animate-pulse-custom"
                style={{
                    width: `${50 * enhancedScale}px`,  // Increased from 40 to 50
                    height: `${50 * enhancedScale}px`,
                    marginLeft: `-${25 * enhancedScale}px`,
                    marginTop: `-${25 * enhancedScale}px`,
                    borderRadius: '50%',
                    backgroundColor: `rgba(255, 255, 255, ${0.17 * glowIntensity})`,
                    border: `${2 * enhancedScale}px solid rgba(255, 255, 255, ${0.75 * glowIntensity})`,
                    boxShadow: `
                        0 0 ${20 * enhancedScale}px ${10 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 0.45),
                        0 0 ${40 * enhancedScale}px ${20 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 0.25)
                    `,
                    backdropFilter: 'blur(2px)',
                    transition: 'all 0.2s ease',
                }}
            />
            
            {/* Middle ring */}
            <div
                className="absolute"
                style={{
                    width: `${34 * enhancedScale}px`,  // Increased from 28 to 34
                    height: `${34 * enhancedScale}px`,
                    marginLeft: `-${17 * enhancedScale}px`,
                    marginTop: `-${17 * enhancedScale}px`,
                    borderRadius: '50%',
                    border: `${2 * enhancedScale}px solid rgba(255, 255, 255, ${0.9 * glowIntensity})`,
                    boxShadow: `0 0 ${12 * enhancedScale}px ${6 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 0.35)`,
                    transition: 'all 0.2s ease',
                }}
            />
            
            {/* Inner bright core */}
            <div
                className="absolute"
                style={{
                    width: `${22 * enhancedScale}px`,  // Increased from 18 to 22
                    height: `${22 * enhancedScale}px`,
                    marginLeft: `-${11 * enhancedScale}px`,
                    marginTop: `-${11 * enhancedScale}px`,
                    borderRadius: '50%',
                    backgroundColor: `rgba(255, 255, 255, ${0.97 * glowIntensity})`,
                    boxShadow: `
                        0 0 ${18 * enhancedScale}px ${9 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 0.75),
                        inset 0 0 ${10 * enhancedScale}px ${5 * enhancedScale}px rgba(255, 255, 255, 1)
                    `,
                    transition: 'all 0.2s ease',
                }}
            />
            
            {/* Central bright point */}
            <div
                className="absolute"
                style={{
                    width: `${10 * enhancedScale}px`,  // Increased from 8 to 10
                    height: `${10 * enhancedScale}px`,
                    marginLeft: `-${5 * enhancedScale}px`,
                    marginTop: `-${5 * enhancedScale}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: `0 0 ${12 * enhancedScale}px ${6 * enhancedScale * glowIntensity}px rgba(255, 255, 255, 1)`,
                    transition: 'all 0.2s ease',
                }}
            />
        </div>
    );
};

export default CustomCursor;