import { useEffect, useMemo, useState } from 'react'
import stainedglass_1 from '../assets/stainedglass-1.jpg'
import stainedglass_2 from '../assets/stainedglass-2.jpg'
import stainedglass_3 from '../assets/stainedglass-3.jpg'
import stainedglass_4 from '../assets/stainedglass-4.jpg'
import stainedglass_5 from '../assets/stainedglass-5.jpg'
import stainedglass_6 from '../assets/stainedglass-6.jpg'
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
  frontFaceContent?: React.ReactNode | ((isVisible: boolean) => React.ReactNode)
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

    const stainedglasses = [
      stainedglass_1,
      stainedglass_2,
      stainedglass_3,
      stainedglass_4,
      stainedglass_5,
      stainedglass_6,
    ]
    return stainedglasses[Math.floor(Math.random() * stainedglasses.length)]
  }, [stainedGlassImage])

  // Optional intersection observer
  const { targetRef } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Card scaling to fit window while maintaining 9:16 aspect ratio
  const calculateCardScale = () => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const cardWidth = 360 // 9 units
    const cardHeight = 640 // 16 units
    const scaleX = windowWidth / cardWidth
    const scaleY = windowHeight / cardHeight
    return Math.min(scaleX, scaleY) * 0.9 // 90% of available space for padding
  }

  const [cardScale, setCardScale] = useState(() => calculateCardScale())

  // Flip state management
  const [flipState, setFlipState] = useState<'front' | 'back'>(initialFlipState)

  useEffect(() => {
    const updateCardScale = () => {
      setCardScale(calculateCardScale())
    }

    window.addEventListener('resize', updateCardScale)
    return () => window.removeEventListener('resize', updateCardScale)
  }, [])

  if (!enableFlip) {
    // Original single-sided card
    return (
      <div
        className={`h-full w-full flex items-center justify-center group ${className}`}
        style={{ perspective: '1000px' }}
      >
        <div
          className="animate-3d-wobble group-active:animate-none"
          style={{
            width: '360px',
            height: '640px',
            transform: `scale(${cardScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            className="transition-transform ease-in-out duration-1000 scale-90 drop-shadow-2xl group-active:scale-100 group-active:duration-300 group-active:drop-shadow-none"
            style={{ perspective: '1000px' }}
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
              className={`flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full border border-[rgba(212,175,55,0.2)] bg-gray-900 ${
                onClick ? 'cursor-pointer' : ''
              }`}
              style={{
                width: '360px',
                height: '640px',
              }}
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
              {/* {enableLightEffects && (
                <div className="light-overlay absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen"></div>
              )} */}
              {children && (
                <div className="relative z-40 flex flex-col justify-center items-center w-full h-full">{children}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Flippable card with front/back faces
  return (
    <div
      className={`h-full w-full flex items-center justify-center group font-medieval text-4xl ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className="animate-3d-wobble group-active:animate-none"
        style={{
          width: '360px',
          height: '640px',
          transform: `scale(${cardScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="transition-transform ease-in-out duration-1000 scale-90 drop-shadow-2xl group-active:scale-100 group-active:duration-300 group-active:drop-shadow-none"
          style={{ perspective: '1000px' }}
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
            className="relative transition-transform duration-500"
            style={{
              width: '360px',
              height: '640px',
              transform: flipState === 'front' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Back Face - Stained Glass */}
            <div
              className="absolute flex flex-col justify-center items-center p-8 overflow-hidden rounded-lg w-full h-full border border-[rgba(212,175,55,0.2)] bg-gray-900 cursor-pointer"
              style={{
                width: '360px',
                height: '640px',
                backfaceVisibility: 'hidden',
              }}
              onClick={() => {
                setFlipState('front')
                if (onClick) onClick()
              }}
            >
              {enableLightEffects && (
                <div className="light-source absolute -top-[20%] -left-[20%] w-[140%] h-[140%] pointer-events-none z-10"></div>
              )}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-100 mix-blend-overlay"
                style={{
                  backgroundImage: `url('${stainedglass}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              {/* {enableLightEffects && (
                <div className="light-overlay absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen"></div>
              )} */}
              {children && (
                <div className="relative z-40 flex flex-col justify-center items-center w-full h-full">{children}</div>
              )}
            </div>

            {/* Front Face - Black with PngFont */}
            <div
              className="absolute left-0 top-0 flex flex-col justify-center items-center p-8 overflow-hidden rounded-lg w-full h-full bg-black border border-[rgba(212,175,55,0.2)] cursor-pointer shadow-[inset_0_0_60px_theme(colors.yellow.400/30%)]"
              style={{
                width: '360px',
                height: '640px',
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
              onClick={() => {
                setFlipState('back')
                if (onClick) onClick()
              }}
            >
              {frontFaceContent && (
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                  {typeof frontFaceContent === 'function' ? frontFaceContent(flipState === 'front') : frontFaceContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export intersection observer result for components that need it
export { useIntersectionObserver }
