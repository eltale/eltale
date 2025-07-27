import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface StainedGlassCardProps {
  children?: ReactNode
  stainedGlassImage?: string
  verseReference?: string
  onClick?: () => void
  enableLightEffects?: boolean
  useIntersectionObserver?: boolean
  className?: string
  innerRef?: RefObject<HTMLDivElement | null>
  enableFlip?: boolean
  frontFaceContent?: ReactNode | ((isVisible: boolean) => ReactNode)
  initialFlipState?: 'front' | 'back'
}

export default function StainedGlassCard({
  children,
  stainedGlassImage,
  verseReference,
  onClick,
  enableLightEffects = true,
  useIntersectionObserver: enableIntersectionObserver = false,
  className = '',
  innerRef,
  enableFlip = false,
  frontFaceContent,
  initialFlipState = 'back',
}: StainedGlassCardProps) {
  // Hash-based stained glass selection using verse reference
  const [stainedglass, setStainedglass] = useState<string>('')

  useEffect(() => {
    const loadStainedGlass = async () => {
      if (stainedGlassImage) {
        setStainedglass(stainedGlassImage)
        return
      }

      // Simple hash function for verse reference
      const hashString = (str: string) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i)
          hash = (hash << 5) - hash + char
          hash = hash & hash // Convert to 32-bit integer
        }
        return Math.abs(hash)
      }

      // Dynamically discover all stained glass images
      const stainedGlassModules = import.meta.glob('../assets/stainedglass-*.jpg')
      const imageKeys = Object.keys(stainedGlassModules)

      if (imageKeys.length === 0) {
        console.error('No stained glass images found')
        return
      }

      const index = verseReference
        ? hashString(verseReference) % imageKeys.length
        : Math.floor(Math.random() * imageKeys.length)
      const selectedKey = imageKeys[index]

      try {
        const imageModule = (await stainedGlassModules[selectedKey]()) as { default: string }
        setStainedglass(imageModule.default)
      } catch (error) {
        console.error(`Failed to load ${selectedKey}:`, error)
        // Fallback to first available image
        try {
          const fallbackModule = (await stainedGlassModules[imageKeys[0]]()) as { default: string }
          setStainedglass(fallbackModule.default)
        } catch (fallbackError) {
          console.error('Failed to load fallback image:', fallbackError)
        }
      }
    }

    loadStainedGlass()
  }, [stainedGlassImage, verseReference])

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
