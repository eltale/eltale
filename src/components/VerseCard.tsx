import { useEffect, useState, useRef } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import AnimatedText from './AnimatedText'

interface BibleVerse {
  id: string
  text: string
  reference: string
  book: string
  chapter: number
  verse: number
}

interface VerseCardProps {
  verse: BibleVerse
  isFirstCard?: boolean
}

const getRandomGradient = (verseId: string) => {
  const medievalGradients = [
    'bg-gradient-to-b from-brown-dark via-burgundy to-red-dark',
    'bg-gradient-to-b from-stone via-burgundy to-brown-dark',
    'bg-gradient-to-b from-red-dark via-brown-dark to-burgundy',
    'bg-gradient-to-b from-burgundy via-stone to-red-dark',
    'bg-gradient-to-b from-brown-dark via-red-dark to-stone',
    'bg-gradient-to-br from-burgundy via-brown-dark to-red-dark',
    'bg-gradient-to-bl from-stone via-burgundy to-brown-dark',
    'bg-gradient-to-tr from-red-dark via-burgundy to-stone',
    'bg-gradient-to-tl from-brown-dark via-stone to-burgundy',
    'bg-gradient-to-b from-burgundy to-brown-dark',
    'bg-gradient-to-b from-red-dark to-burgundy',
    'bg-gradient-to-b from-stone to-red-dark',
  ]

  // Use verse ID to create consistent but seemingly random selection
  const hash = verseId.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return medievalGradients[Math.abs(hash) % medievalGradients.length]
}

export default function VerseCard({ verse, isFirstCard = false }: VerseCardProps) {
  const gradientClass = getRandomGradient(verse.id)
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Check if this is the user's first time
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  
  // Auto-scaling text
  const [textScale, setTextScale] = useState(1)
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFirstCard) {
      const hasVisited = localStorage.getItem('eltale-visited')
      if (!hasVisited) {
        setIsFirstTimeUser(true)
        localStorage.setItem('eltale-visited', 'true')
      }
    }
  }, [isFirstCard])

  useEffect(() => {
    if (isFirstTimeUser && hasIntersected && isFirstCard) {
      // Show swipe hint after text animation completes
      const timer = setTimeout(() => {
        setShowSwipeHint(true)
      }, 2500) // After text animations finish

      return () => clearTimeout(timer)
    }
  }, [isFirstTimeUser, hasIntersected, isFirstCard])

  // Hide hint after scroll or interaction
  useEffect(() => {
    const handleScroll = () => setShowSwipeHint(false)
    const handleTouch = () => setShowSwipeHint(false)

    if (showSwipeHint) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('touchstart', handleTouch, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('touchstart', handleTouch)
      }
    }
  }, [showSwipeHint])

  // Auto-scale text to fit within decorative borders
  useEffect(() => {
    if (hasIntersected && textRef.current && containerRef.current) {
      const checkTextFit = () => {
        const textElement = textRef.current
        const container = containerRef.current
        if (!textElement || !container) return

        // Reset scale to measure natural size
        setTextScale(1)
        
        setTimeout(() => {
          const containerRect = container.getBoundingClientRect()
          const textRect = textElement.getBoundingClientRect()
          
          // Calculate available space (excluding decorative borders and padding)
          const availableWidth = containerRect.width - 160 // 80px border + padding on each side
          const availableHeight = containerRect.height - 200 // Top/bottom margins + reference space
          
          // Calculate scale needed to fit
          const widthScale = availableWidth / textRect.width
          const heightScale = availableHeight / textRect.height
          
          // Use the smaller scale factor to ensure both dimensions fit
          const scale = Math.min(widthScale, heightScale, 1) // Don't scale up, only down
          
          if (scale < 1) {
            setTextScale(scale * 0.95) // Add small buffer
          }
        }, 100) // Small delay to ensure DOM is updated
      }

      checkTextFit()
      
      // Re-check on window resize
      window.addEventListener('resize', checkTextFit)
      return () => window.removeEventListener('resize', checkTextFit)
    }
  }, [hasIntersected, verse.text])

  return (
    <div className="h-screen w-full flex items-center justify-center p-8 card-3d">
      <div
        ref={(el) => {
          targetRef.current = el
          containerRef.current = el
        }}
        className={`card-inner ${gradientClass} flex flex-col justify-center items-center p-8 relative overflow-hidden w-full max-w-md h-4/5 rounded-lg`}
      >
        {/* Decorative medieval border elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-gold opacity-60"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-gold opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-gold opacity-60"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-gold opacity-60"></div>

        {/* Central ornament */}
        {!showSwipeHint && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        )}

        {/* Verse content */}
        <div 
          ref={textRef}
          className="max-w-4xl text-center space-y-8 relative z-10 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${textScale})`,
            transformOrigin: 'center center'
          }}
        >
          <blockquote className="font-medieval text-2xl md:text-3xl lg:text-4xl text-cream leading-relaxed tracking-wide">
            {hasIntersected && <AnimatedText>{verse.text}</AnimatedText>}
          </blockquote>
        </div>

        {/* Bottom ornament */}
        <div className="absolute h-1 bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative space-y-2 flex flex-col items-center">
            <div
              className="w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto transition-all duration-1000 ease-out"
              style={{
                opacity: hasIntersected ? 1 : 0,
                transform: hasIntersected ? 'scaleX(1)' : 'scaleX(0)',
                transitionDelay: hasIntersected ? '1000ms' : '0ms',
              }}
            />
            <cite className="font-medieval text-xl md:text-2xl text-gold-dark tracking-widest block whitespace-nowrap">
              {verse.reference}
            </cite>
          </div>
        </div>

        {/* First-time swipe hint */}
        {showSwipeHint && (
          <div className="absolute z-50 top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-cream/70 animate-bounce">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-0.5 h-4 bg-gradient-to-t from-cream/70 to-transparent"></div>
              <svg className="w-4 h-4 text-cream/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" />
              </svg>
            </div>
            <p className="font-medieval text-xs tracking-wide mt-1 text-center">Swipe up</p>
          </div>
        )}
      </div>
    </div>
  )
}
