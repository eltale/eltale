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

export default function VerseCard({ verse }: VerseCardProps) {
  const gradientClass = getRandomGradient(verse.id)
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4,
    triggerOnce: true,
  })

  return (
    <div className="h-screen w-full flex items-center justify-center p-8 card-3d">
      <div
        ref={targetRef}
        className={`card-inner ${gradientClass} flex flex-col justify-center items-center p-8 relative overflow-hidden w-full max-w-md h-4/5 rounded-lg`}
      >
        {/* Decorative medieval border elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-gold opacity-60"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-gold opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-gold opacity-60"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-gold opacity-60"></div>

        {/* Central ornament */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

        {/* Verse content */}
        <div className="max-w-4xl text-center space-y-8 relative z-10">
          <blockquote className="font-medieval text-2xl md:text-3xl lg:text-4xl text-cream leading-relaxed tracking-wide">
            {hasIntersected && <AnimatedText>{verse.text}</AnimatedText>}
          </blockquote>

          <div className="space-y-2">
            <div
              className="w-24 h-0.5 bg-gold mx-auto transition-all duration-1000 ease-out"
              style={{
                opacity: hasIntersected ? 1 : 0,
                transform: hasIntersected ? 'scaleX(1)' : 'scaleX(0)',
                transitionDelay: hasIntersected ? '1000ms' : '0ms',
              }}
            />
            <cite className="font-medieval text-xl md:text-2xl text-gold-dark tracking-widest block">
              {verse.reference}
            </cite>
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      </div>
    </div>
  )
}
