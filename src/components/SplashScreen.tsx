import StainedGlassCard from './StainedGlassCard'
import stainedglass from '../assets/splash.jpg'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <StainedGlassCard
      stainedGlassImage={stainedglass}
      onClick={onComplete}
    />
  )
}
