import { useState, useEffect, useRef, useCallback } from 'react';
import VerseCard from './VerseCard';
import { useBibleVerses } from '../hooks/useBibleVerses';

export default function VerseViewer() {
  const { verses, loading, loadNextVerse } = useBibleVerses();
  const [loadedVerses, setLoadedVerses] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize with first verse and pre-load next one
  useEffect(() => {
    if (verses.length > 0 && loadedVerses.length === 0) {
      setLoadedVerses([verses[0]]);
      // Pre-load the next verse immediately
      loadNextVerse();
    }
  }, [verses, loadedVerses.length]);

  // Always ensure we have a next verse loaded
  useEffect(() => {
    const loadNextIfNeeded = async () => {
      if (loadedVerses.length > 0 && !isLoadingMore) {
        // Check if we need to load the next verse (always keep one ahead)
        const totalAvailable = verses.length;
        if (loadedVerses.length === totalAvailable) {
          setIsLoadingMore(true);
          const newVerse = await loadNextVerse();
          if (newVerse) {
            setLoadedVerses(prev => [...prev, newVerse]);
          }
          setIsLoadingMore(false);
        }
      }
    };

    loadNextIfNeeded();
  }, [loadedVerses.length, verses.length, isLoadingMore, loadNextVerse]);

  const handleScroll = useCallback(async () => {
    if (!containerRef.current || isLoadingMore) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // More aggressive pre-loading - trigger when we're within 1.5 screen heights of the bottom
    const triggerDistance = clientHeight * 1.5;
    
    if (scrollTop + clientHeight >= scrollHeight - triggerDistance) {
      setIsLoadingMore(true);
      
      // Load next verse
      const newVerse = await loadNextVerse();
      if (newVerse) {
        setLoadedVerses(prev => [...prev, newVerse]);
      }
      
      setIsLoadingMore(false);
    }
  }, [loadNextVerse, isLoadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (loading && loadedVerses.length === 0) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-brown-dark to-burgundy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medieval text-gold text-xl">Loading sacred texts...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hidden verse-viewer-container"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        zIndex: 10
      }}
    >
      
      {loadedVerses.map((verse, index) => (
        <div key={verse.id} className="snap-start snap-always">
          <VerseCard verse={verse} />
        </div>
      ))}
    </div>
  );
}