import { useEffect, useRef, useState } from 'react'
import StainedGlassCard, { useIntersectionObserver } from './StainedGlassCard'
import PngFont from './PngFont'

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
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Check if this is the user's first time
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

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


  return (
    <StainedGlassCard
      useIntersectionObserver={true}
      innerRef={containerRef}
      enableFlip={true}
      frontFaceContent={<PngFont text={verse.text} className="max-w-full px-4" />}
    >
    </StainedGlassCard>
  )
}
