import { useState, useEffect, useRef } from 'react';
import VerseCard from './VerseCard';
import { useBibleVerses } from '../hooks/useBibleVerses';

export default function VerseViewer() {
  const { verses, loading, loadNextVerse } = useBibleVerses();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    
    if (deltaY > 0) {
      setTranslateY(-Math.min(deltaY, window.innerHeight));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = window.innerHeight * 0.2;
    
    if (Math.abs(translateY) > threshold) {
      handleSwipeUp();
    }
    
    setTranslateY(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    
    if (deltaY > 0) {
      setTranslateY(-Math.min(deltaY, window.innerHeight));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = window.innerHeight * 0.2;
    
    if (Math.abs(translateY) > threshold) {
      handleSwipeUp();
    }
    
    setTranslateY(0);
    setIsDragging(false);
  };

  const handleSwipeUp = async () => {
    if (currentIndex === verses.length - 1) {
      await loadNextVerse();
    }
    setCurrentIndex(prev => Math.min(prev + 1, verses.length));
  };

  useEffect(() => {
    if (verses.length > 0 && currentIndex >= verses.length) {
      setCurrentIndex(verses.length - 1);
    }
  }, [verses.length, currentIndex]);

  if (loading && verses.length === 0) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-brown-dark to-burgundy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medieval text-gold text-xl">Loading sacred texts...</p>
        </div>
      </div>
    );
  }

  const currentVerse = verses[currentIndex];

  if (!currentVerse) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-brown-dark to-burgundy flex items-center justify-center">
        <p className="font-medieval text-cream text-xl">No verses available</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateY(${translateY}px)` 
        }}
      >
        <VerseCard verse={currentVerse} />
      </div>
    </div>
  );
}