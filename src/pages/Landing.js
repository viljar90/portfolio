import React, { useState, useEffect, useRef, useMemo } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import NavigationMenu from "../components/NavigationMenu";
import CustomCursor from "../components/CustomCursor";
import useDarkMode from "../components/hooks/useDarkMode";
import { gsap } from "gsap";
import "../styles/App.css";

const Landing = () => {
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasAnimationCompleted, setHasAnimationCompleted] = useState(false);
  const [userHasMoved, setUserHasMoved] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  
  // Shadow text cycling states
  const [shadowText, setShadowText] = useState("Viljar Tornøe");
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [movementSpeed, setMovementSpeed] = useState(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  
  // Flag to track if this is the first movement
  const isFirstMoveRef = useRef(true);
  
  // Spotlight ref
  const spotlightRef = useRef(null);
  
  // Title references
  const titleRef = useRef(null);
  const shadowRef = useRef(null);
  const buttonRef = useRef(null);
  const buttonShadowRef = useRef(null);
  
  // Wrap the array in useMemo to prevent re-creation on each render
  const designTexts = useMemo(() => [
    "Viljar Tornøe", 
    "Product Designer", 
    "UX Designer", 
    "AI Designer", 
    "UI Designer", 
    "Conceptualist", 
    "Design Strategy", 
    "Brand Design", 
    "Innovator"
  ], []);
  
  // GSAP Animation for title
  useEffect(() => {
    if (!titleRef.current) return;
    
    // Set initial state
    gsap.set(titleRef.current, {
      y: 15,
      textShadow: "none"
    });
    
    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimationCompleted(true);
      }
    });
    
    // Define animation sequence
    tl.to(titleRef.current, {
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Add shadow animation with slight delay
    tl.to(titleRef.current, {
      textShadow: "0px 15px 20px rgba(0, 0, 0, 0.4)",
      duration: 0.6,
      ease: "power1.inOut"
    }, "-=0.5"); // Overlap the animations
    
    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);
  
  // Track mouse cursor position and detect first movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Update mouse position
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // If this is the first movement after animation completed, mark it
      if (hasAnimationCompleted && !userHasMoved) {
        setUserHasMoved(true);
        isFirstMoveRef.current = true;
        
        // Initialize the lastPosRef
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        
        // Set initial time
        setLastMoveTime(Date.now());
        
        // Now remove the initial text shadow
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            textShadow: "none",
            duration: 0.3,
            ease: "power1.out"
          });
        }
        
        // Reveal button shadow on first movement
        if (buttonShadowRef.current) {
          buttonShadowRef.current.style.opacity = '0.7';
        }
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hasAnimationCompleted, userHasMoved]);
  
  // Handle button hover state
  const handleButtonMouseEnter = () => {
    setIsHoveringButton(true);
    
    // Show shadow on hover even before movement
    if (buttonShadowRef.current) {
      buttonShadowRef.current.style.opacity = '0.8';  // Slightly stronger on hover
    }
  };
  
  const handleButtonMouseLeave = () => {
    setIsHoveringButton(false);
    
    // If user hasn't moved yet, hide the shadow again
    if (!userHasMoved && buttonShadowRef.current) {
      buttonShadowRef.current.style.opacity = '0';
    } else if (buttonShadowRef.current) {
      buttonShadowRef.current.style.opacity = '0.7'; // Back to normal
    }
  };
  
  // Cycle through shadow texts based on mouse movement and speed
  useEffect(() => {
    // Skip if animation not complete or user hasn't moved
    if (!hasAnimationCompleted || !userHasMoved) return;
    
    // Skip comparison on very first movement
    if (isFirstMoveRef.current) {
      isFirstMoveRef.current = false;
      return;
    }
    
    const now = Date.now();
    
    // Calculate cursor movement distance
    const dx = mousePos.x - lastPosRef.current.x;
    const dy = mousePos.y - lastPosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only update if there's actual movement
    if (distance > 0) {
      // Update movement speed with smoothing (80% previous speed, 20% current speed)
      const newSpeed = 0.8 * movementSpeed + 0.2 * distance;
      setMovementSpeed(newSpeed);
      
      // Adjust debounce time based on movement speed - faster movement = quicker changes
      const debounceTime = Math.max(800 - newSpeed * 2, 400); // Between 400-800ms
      
      if (now - lastMoveTime > debounceTime) {
        // Require more significant movement for slower users
        const speedThreshold = 20 + (800 - debounceTime) / 10; // Dynamic threshold
        
        if (distance > speedThreshold) {
          // Change text based on movement
          setShadowText(prevText => {
            const currentIndex = designTexts.indexOf(prevText);
            const nextIndex = (currentIndex + 1) % designTexts.length;
            return designTexts[nextIndex];
          });
          
          // Update last move time
          setLastMoveTime(now);
        }
      }
      
      // Always update position reference for next comparison
      lastPosRef.current = { x: mousePos.x, y: mousePos.y };
    }
  }, [mousePos.x, mousePos.y, hasAnimationCompleted, userHasMoved, lastMoveTime, movementSpeed, designTexts]);
  
  // Calculate and apply dynamic shadow effects
  useEffect(() => {
    const title = titleRef.current;
    const shadowElement = shadowRef.current;
    const spotlight = spotlightRef.current;
    const buttonShadow = buttonShadowRef.current;
    const button = buttonRef.current;
    
    if (!title || !shadowElement) return;
    
    const titleRect = title.getBoundingClientRect();
    
    const titleCenter = {
      x: titleRect.left + titleRect.width / 2,
      y: titleRect.top + titleRect.height / 2,
    };
    
    // Calculate distance from cursor to text center
    const dxTitle = mousePos.x - titleCenter.x;
    const dyTitle = mousePos.y - titleCenter.y;
    const distanceToTitle = Math.sqrt(dxTitle * dxTitle + dyTitle * dyTitle);
    
    // Calculate shadow offset for title (opposite direction of cursor)
    const offsetXTitle = -dxTitle;
    const offsetYTitle = -dyTitle;
    
    // Only apply dynamic shadow effects after animation completes AND user has moved cursor
    if (hasAnimationCompleted && userHasMoved) {
      // *** CONSISTENT SHADOW PARAMETERS ***
      // Same movement multipliers for both shadows
      const horizontalMovement = 0.25; // Consistent horizontal movement
      const verticalMovement = 0.12;   // Consistent vertical movement
      const scaleMultiplier = 0.001;   // Consistent scale multiplier
      
      // TITLE SHADOW EFFECT
      // Calculate dynamic shadow size based on distance
      const titleShadowScale = 1 + (distanceToTitle * scaleMultiplier);
      
      // Subtle blur logic - slightly more blur when close (6.5px), less when far (4px)
      const closeBlurTitle = 6.5; // Blur when cursor is very close
      const farBlurTitle = 4;    // Minimum blur when cursor is far away
      
      // Simple linear interpolation based on distance
      const blurAmountTitle = Math.max(
        farBlurTitle,
        closeBlurTitle - (distanceToTitle * 0.005)
      );
      
      // Apply dynamic styles to the shadow element without transition
      shadowElement.style.transform = `translate(${offsetXTitle * horizontalMovement}px, ${offsetYTitle * verticalMovement}px) scale(${titleShadowScale})`;
      shadowElement.style.filter = `blur(${blurAmountTitle}px)`;
      shadowElement.style.opacity = isDarkMode ? 0.8 : 0.5;
      
      // BUTTON SHADOW EFFECT
      if (button && buttonShadow) {
        const buttonRect = button.getBoundingClientRect();
        const buttonCenter = {
          x: buttonRect.left + buttonRect.width / 2,
          y: buttonRect.top + buttonRect.height / 2,
        };
        
        // Calculate distance from cursor to button center
        const dxButton = mousePos.x - buttonCenter.x;
        const dyButton = mousePos.y - buttonCenter.y;
        const distanceToButton = Math.sqrt(dxButton * dxButton + dyButton * dyButton);
        
        // Calculate shadow offset for button (opposite direction of cursor)
        const offsetXButton = -dxButton;
        const offsetYButton = -dyButton;
        
        // Calculate shadow properties for button - now using the same multipliers
        const buttonShadowScale = 1 + (distanceToButton * scaleMultiplier);
        
        // Button shadow is more intense when cursor is closer for better cut-out effect
        const buttonOpacity = Math.min(0.95, Math.max(0.5, 1 - (distanceToButton / 1000)));
        const buttonBlur = Math.max(2, 5 - (distanceToButton * 0.01));
        
        // Apply dynamic styles to the button shadow - using same movement multipliers
        buttonShadow.style.transform = `translate(${offsetXButton * horizontalMovement}px, ${offsetYButton * verticalMovement}px) scale(${buttonShadowScale})`;
        buttonShadow.style.filter = `blur(${buttonBlur}px)`;
        buttonShadow.style.opacity = isHoveringButton ? 1 : buttonOpacity * (isDarkMode ? 1 : 0.9);
      }
      
      // Update spotlight position and size if it exists
      if (spotlight) {
        // Maximum horizontal movement (unchanged)
        const maxHorizontalOffset = 120;
        
        // Reduced vertical movement (60% of horizontal)
        const maxVerticalOffset = 70; 
        
        // Movement factor calculation
        const movementFactor = Math.sqrt(Math.min(1, distanceToTitle / 900));
        
        // Add a small randomness factor to make movement more organic
        const randomness = Math.sin(Date.now() / 1200) * 4;
        
        // Calculate spotlight position with different horizontal and vertical ranges
        const normalizedDx = dxTitle / Math.max(Math.abs(dxTitle), 100);
        const normalizedDy = dyTitle / Math.max(Math.abs(dyTitle), 100);
        
        const spotlightOffsetX = normalizedDx * maxHorizontalOffset * movementFactor + randomness;
        const spotlightOffsetY = normalizedDy * maxVerticalOffset * movementFactor - randomness;
        
        // Position spotlight around the title with offset based on cursor
        spotlight.style.left = `${titleCenter.x + spotlightOffsetX}px`;
        spotlight.style.top = `${titleCenter.y + spotlightOffsetY}px`;
        
        // Adjust spotlight intensity based on cursor proximity
        const minOpacity = isDarkMode ? 0.5 : 0.7;
        const maxOpacity = isDarkMode ? 0.85 : 0.9;
        const opacityRange = maxOpacity - minOpacity;
        const proximityFactor = Math.max(0, 1 - distanceToTitle / 1000);
        const spotlightOpacity = minOpacity + (opacityRange * proximityFactor);
        
        // Apply the opacity
        spotlight.style.opacity = spotlightOpacity;
      }
    }
  }, [mousePos, hasAnimationCompleted, userHasMoved, isDarkMode, isHoveringButton]);
  
  // Handle button click
  const handleButtonClick = () => {
    // Add your navigation logic here
    console.log('Button clicked - navigate to work');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <NavigationMenu darkMode={isDarkMode} />
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Title and Shadow Container - This keeps the title centered */}
        <div className="relative">
          {/* Circular spotlight on the text */}
          {hasAnimationCompleted && userHasMoved && (
            <div
              ref={spotlightRef}
              className="fixed pointer-events-none"
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(
                  circle at center,
                  rgba(255, 255, 255, ${isDarkMode ? '0.6' : '1.0'}) 0%,
                  rgba(255, 255, 255, ${isDarkMode ? '0.5' : '0.9'}) 20%,
                  rgba(255, 255, 255, ${isDarkMode ? '0.3' : '0.7'}) 50%,
                  rgba(255, 255, 255, ${isDarkMode ? '0.1' : '0.3'}) 75%,
                  rgba(255, 255, 255, 0) 90%
                )`,
                boxShadow: isDarkMode 
                  ? '0 0 60px 30px rgba(255, 255, 255, 0.25)' 
                  : '0 0 50px 25px rgba(255, 255, 255, 0.5)',
                zIndex: 9,
                transition: 'left 0.3s ease, top 0.3s ease, opacity 0.3s ease',
                mixBlendMode: isDarkMode ? 'normal' : 'overlay',
              }}
            />
          )}
          
          {/* Shadow Text Element - Now with no transform transition */}
          <div 
            ref={shadowRef} 
            className={`absolute z-0 text-7xl font-bold text-black pointer-events-none whitespace-nowrap`}
            style={{ 
              transition: "filter 0.2s ease, opacity 0.4s ease", // Removed transform from transition
              opacity: (!hasAnimationCompleted || !userHasMoved) ? 0 : (isDarkMode ? 0.8 : 0.5),
              filter: (!hasAnimationCompleted || !userHasMoved) ? "blur(0px)" : "blur(6px)",
              minWidth: '100%',
              textAlign: 'center',
              willChange: 'transform', // Performance hint for browser
            }}
          >
            {shadowText}
          </div>
          
          {/* Main Title - Using GSAP for animation */}
          <h1
            ref={titleRef}
            className="text-7xl font-bold relative z-10 fade-in-title"
            style={{ 
              color: isDarkMode ? "#111827" : "#e8eaee",
            }}
            onAnimationEnd={() => setHasAnimationCompleted(true)}
          >
            Viljar Tornøe
          </h1>
        </div>
      </div>
      
      {/* CUT-OUT BUTTON - Using SVG with custom mask */}
      <div className="absolute bottom-48 z-10">
        {/* Button container */}
        <div 
          className="relative"
          style={{ 
            width: '300px',
            height: '60px'
          }}
        >
          {/* Shadow layer with visible text that shows through cut-out */}
          <div 
            ref={buttonShadowRef}
            className="absolute inset-0 rounded-md flex items-center justify-center"
            style={{
              // In both modes, shadow is black - natural physics of shadows
              backgroundColor: 'black',
              opacity: 0,  // Start invisible
              zIndex: 1,
              willChange: 'transform',
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Text inside the shadow layer */}
            <span
              style={{
                // In both modes, text is white - like light passing through
                color: 'white',
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Get to know my work
            </span>
          </div>
          
          {/* SVG with cut-out text effect */}
          <svg
            ref={buttonRef}
            className="absolute inset-0 cursor-pointer rounded-md"
            width="300"
            height="60"
            viewBox="0 0 300 60"
            style={{
              zIndex: 2,
              transform: isHoveringButton ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            onClick={handleButtonClick}
          >
            <defs>
              <mask id="textMask">
                <rect width="300" height="60" fill="white" />
                <text 
                  x="150" 
                  y="35" 
                  fontFamily="Arial" 
                  fontSize="16" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  fill="black"
                >
                  Get to know my work
                </text>
              </mask>
            </defs>
            {/* Background rect with the mask applied */}
            <rect 
              width="300" 
              height="60" 
              fill={isDarkMode ? "#111827" : "#e8eaee"} 
              mask="url(#textMask)"
              rx="4"
              ry="4"
            />
          </svg>
        </div>
      </div>
      
      <CustomCursor />
      
      <DarkModeToggle
        darkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
};

export default Landing;