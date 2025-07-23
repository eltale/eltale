import { useEffect, useState } from 'react'
import stainedglass from '../assets/loading.jpg'

export default function LoadingScreen() {
  // Card scaling to fit window
  const [cardScale, setCardScale] = useState(1)

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
          className={`card-inner flex flex-col justify-center items-center p-8 relative overflow-hidden rounded-lg w-full h-full bg-cover bg-center`}
          style={{
            backgroundImage: `url('${stainedglass}')`,
            backgroundSize: 'cover',
          }}
        />
      </div>
    </div>
  )
}
