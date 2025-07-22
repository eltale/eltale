import React, { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  isVisible?: boolean;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  isVisible = false,
  delay = 0 
}) => {
  const [animatedLetters, setAnimatedLetters] = useState<Array<{
    char: string;
    isSpace: boolean;
    originX: number;
    originY: number;
    delay: number;
  }>>([]);

  // 8-point clock positions around screen border
  const getRandomOrigin = () => {
    const positions = [
      { x: -100, y: -100 }, // top-left
      { x: 50, y: -100 },   // top
      { x: 200, y: -100 },  // top-right
      { x: 200, y: 50 },    // right
      { x: 200, y: 200 },   // bottom-right
      { x: 50, y: 200 },    // bottom
      { x: -100, y: 200 },  // bottom-left
      { x: -100, y: 50 },   // left
    ];
    
    const position = positions[Math.floor(Math.random() * positions.length)];
    return {
      originX: position.x,
      originY: position.y,
    };
  };

  useEffect(() => {
    if (text) {
      const letters = text.split('').map((char, index) => {
        const origin = getRandomOrigin();
        return {
          char,
          isSpace: char === ' ',
          originX: origin.originX,
          originY: origin.originY,
          delay: index * 30 + Math.random() * 50, // Stagger with some randomness
        };
      });
      setAnimatedLetters(letters);
    }
  }, [text]);

  return (
    <span className={`inline-block ${className}`}>
      {animatedLetters.map((letter, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-700 ease-out ${
            letter.isSpace ? 'w-2' : ''
          }`}
          style={{
            transform: isVisible 
              ? 'translateX(0) translateY(0) scale(1) rotate(0deg)' 
              : `translateX(${letter.originX}vw) translateY(${letter.originY}vh) scale(0.3) rotate(${Math.random() * 720 - 360}deg)`,
            opacity: isVisible ? 1 : 0,
            transitionDelay: isVisible ? `${delay + letter.delay}ms` : '0ms',
            filter: isVisible ? 'blur(0px)' : 'blur(3px)',
          }}
        >
          {letter.char === ' ' ? '\u00A0' : letter.char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;