import { useEffect, useMemo, useState } from 'react'
import stainedglass_1 from '../assets/stainedglass-1.jpg'
import stainedglass_2 from '../assets/stainedglass-2.jpg'
import stainedglass_3 from '../assets/stainedglass-3.jpg'
import stainedglass_4 from '../assets/stainedglass-4.jpg'
import stainedglass_5 from '../assets/stainedglass-5.jpg'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface StainedGlassCardProps {
  children?: React.ReactNode
  stainedGlassImage?: string
  onClick?: () => void
  enableLightEffects?: boolean
  useIntersectionObserver?: boolean
  className?: string
  innerRef?: React.RefObject<HTMLDivElement | null>
  enableFlip?: boolean
  frontFaceContent?: React.ReactNode
  initialFlipState?: 'front' | 'back'
}

export default function StainedGlassCard({
  children,
  stainedGlassImage,
  onClick,
  enableLightEffects = true,
  useIntersectionObserver: enableIntersectionObserver = false,
  className = '',
  innerRef,
  enableFlip = false,
  frontFaceContent,
  initialFlipState = 'back',
}: StainedGlassCardProps) {
  // Random stained glass selection if no custom image provided
  const stainedglass = useMemo(() => {
    if (stainedGlassImage) return stainedGlassImage

    const stainedglasses = [stainedglass_1, stainedglass_2, stainedglass_3, stainedglass_4, stainedglass_5]
    return stainedglasses[Math.floor(Math.random() * stainedglasses.length)]
  }, [stainedGlassImage])

  // Optional intersection observer
  const { targetRef } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Card scaling to fit window while maintaining 9:16 aspect ratio
  const [cardScale, setCardScale] = useState(1)

  // Flip state management
  const [flipState, setFlipState] = useState<'front' | 'back'>(initialFlipState)

  const handleCardClick = () => {
    if (enableFlip) {
      setFlipState(prev => (prev === 'front' ? 'back' : 'front'))
    }
    if (onClick) {
      onClick()
    }
  }

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

  if (!enableFlip) {
    // Original single-sided card
    return (
      <div
        className={`h-full w-full flex items-center justify-center ${className}`}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
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
              if (enableIntersectionObserver) {
                targetRef.current = el
              }
              if (innerRef && el) {
                innerRef.current = el
              }
            }}
            className={`card-inner flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full border border-[rgba(212,175,55,0.2)] bg-gray-900 ${
              onClick ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
          >
            {enableLightEffects && (
              <div className="light-source absolute -top-[20%] -left-[20%] w-[140%] h-[140%] pointer-events-none z-10"></div>
            )}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-30 mix-blend-overlay opacity-100"
              style={{
                backgroundImage: `url('${stainedglass}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            {enableLightEffects && (
              <div className="light-overlay absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen"></div>
            )}
            {children && (
              <div className="relative z-40 flex flex-col justify-center items-center w-full h-full">{children}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Flippable card with front/back faces
  return (
    <div
      className={`h-full w-full flex items-center justify-center group ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
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
            if (enableIntersectionObserver) {
              targetRef.current = el
            }
            if (innerRef && el) {
              innerRef.current = el
            }
          }}
          className={`relative w-full h-full cursor-pointer transition-transform duration-700 ease-in-out ${
            flipState === 'front' ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
          onClick={handleCardClick}
        >
          {/* Back Face - Stained Glass */}
          <div
            className={`card-inner absolute inset-0 flex flex-col justify-center items-center p-8 overflow-hidden rounded-lg w-full h-full border border-[rgba(212,175,55,0.2)] bg-gray-900 ${
              flipState === 'front' ? 'rotate-y-180' : ''
            }`}
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {enableLightEffects && (
              <div className="light-source absolute -top-[20%] -left-[20%] w-[140%] h-[140%] pointer-events-none z-10"></div>
            )}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none z-30 mix-blend-overlay opacity-100"
              style={{
                backgroundImage: `url('${stainedglass}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            {enableLightEffects && (
              <div className="light-overlay absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen"></div>
            )}
            {children && (
              <div className="relative z-40 flex flex-col justify-center items-center w-full h-full">{children}</div>
            )}
          </div>

          {/* Front Face - Black with PngFont */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center p-8 overflow-hidden rounded-lg w-full h-full bg-black border border-[rgba(212,175,55,0.2)] rotate-y-180"
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {frontFaceContent && (
              <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                {frontFaceContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export intersection observer result for components that need it
export { useIntersectionObserver }
