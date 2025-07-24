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
  innerRef?: React.RefObject<HTMLDivElement>
}

export default function StainedGlassCard({ 
  children,
  stainedGlassImage,
  onClick,
  enableLightEffects = true,
  useIntersectionObserver: enableIntersectionObserver = false,
  className = '',
  innerRef
}: StainedGlassCardProps) {
  // Random stained glass selection if no custom image provided
  const stainedglass = useMemo(() => {
    if (stainedGlassImage) return stainedGlassImage
    
    const stainedglasses = [stainedglass_1, stainedglass_2, stainedglass_3, stainedglass_4, stainedglass_5]
    return stainedglasses[Math.floor(Math.random() * stainedglasses.length)]
  }, [stainedGlassImage])

  // Optional intersection observer
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  // Card scaling to fit window while maintaining 9:16 aspect ratio
  const [cardScale, setCardScale] = useState(1)

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
    <div className={`h-screen w-full flex items-center justify-center card-3d ${className}`}>
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
            if (innerRef) {
              innerRef.current = el
            }
          }}
          className={`card-inner flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          {enableLightEffects && <div className="light-source"></div>}
          <div 
            className="stained-glass-layer"
            style={{
              backgroundImage: `url('${stainedglass}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          {enableLightEffects && <div className="light-overlay"></div>}
          {children && (
            <div className="relative z-10 flex flex-col justify-center items-center w-full h-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export intersection observer result for components that need it
export { useIntersectionObserver }