import { useEffect, useRef, useState } from 'react'
import stainedglass_1 from '../assets/stainedglass-1.jpg'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

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
  // const [textScale, setTextScale] = useState(1)
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Card scaling to fit window
  const [cardScale, setCardScale] = useState(1)

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
  // useEffect(() => {
  //   if (hasIntersected && textRef.current && containerRef.current) {
  //     const checkTextFit = () => {
  //       const textElement = textRef.current
  //       const container = containerRef.current
  //       if (!textElement || !container) return

  //       // Reset scale to measure natural size
  //       // setTextScale(1)

  //       setTimeout(() => {
  //         const containerRect = container.getBoundingClientRect()
  //         const textRect = textElement.getBoundingClientRect()

  //         // Calculate available space (excluding decorative borders and padding)
  //         const availableWidth = containerRect.width - 160 // 80px border + padding on each side
  //         const availableHeight = containerRect.height - 200 // Top/bottom margins + reference space

  //         // Calculate scale needed to fit
  //         const widthScale = availableWidth / textRect.width
  //         const heightScale = availableHeight / textRect.height

  //         // Use the smaller scale factor to ensure both dimensions fit
  //         const scale = Math.min(widthScale, heightScale, 1) // Don't scale up, only down

  //         if (scale < 1) {
  //           setTextScale(scale * 0.95) // Add small buffer
  //         }
  //       }, 100) // Small delay to ensure DOM is updated
  //     }

  //     checkTextFit()

  //     // Re-check on window resize
  //     window.addEventListener('resize', checkTextFit)
  //     return () => window.removeEventListener('resize', checkTextFit)
  //   }
  // }, [hasIntersected, verse.text])

  // Scale card to fit window while maintaining 9:16 aspect ratio
  useEffect(() => {
    const updateCardScale = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // Fixed card dimensions in pixels (9:16 ratio)
      const cardWidth = 360 // 9 units
      const cardHeight = 640 // 16 units

      // Calculate scale to fit (contain) within window
      const scaleX = windowWidth / cardWidth
      const scaleY = windowHeight / cardHeight
      const scale = Math.min(scaleX, scaleY) * 0.9 // 90% of available space for padding

      setCardScale(scale)
    }

    updateCardScale()
    window.addEventListener('resize', updateCardScale)
    return () => window.removeEventListener('resize', updateCardScale)
  }, [])

  return (
    <div className="h-screen w-full flex items-center justify-center card-3d">
      <div
        className="relative"
        style={{
          width: '360px',
          height: '640px',
          transform: `scale(${cardScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          ref={el => {
            targetRef.current = el
            containerRef.current = el
          }}
          className={`card-inner flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full bg-cover bg-center`}
          style={{
            backgroundImage: `url('${stainedglass_1}')`,
          }}
        >
          <div className="text-4xl text-neutral-900 font-extrabold font-medieval">{verse.text}</div>
        </div>
      </div>
    </div>
  )
}
