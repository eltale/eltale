import { useEffect, useMemo, useRef, useState } from 'react'
import stainedglass_1 from '../assets/stainedglass-1.jpg'
import stainedglass_2 from '../assets/stainedglass-2.jpg'
import stainedglass_3 from '../assets/stainedglass-3.jpg'
import stainedglass_4 from '../assets/stainedglass-4.jpg'
import stainedglass_5 from '../assets/stainedglass-5.jpg'
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

export default function VerseCard({ verse, isFirstCard = false }: VerseCardProps) {
  const stainedglass = useMemo(() => {
    const stainedglasses = [stainedglass_1, stainedglass_2, stainedglass_3, stainedglass_4, stainedglass_5]
    return stainedglasses[Math.floor(Math.random() * stainedglasses.length)]
  }, [])

  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Check if this is the user's first time
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

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
          className={`card-inner flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full`}
        >
          <div className="light-source"></div>
          <div
            className="stained-glass-layer"
            style={{
              backgroundImage: `url('${stainedglass}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          {/* <div className="light-overlay"></div> */}
          {/* <PngFont text={verse.text} className="max-w-full px-4 relative z-10" /> */}
        </div>
      </div>
    </div>
  )
}
