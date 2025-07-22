import React, { useEffect, useState } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  isVisible?: boolean
  delay?: number
  cardId?: string // Add card ID to ensure consistent origin per card
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  isVisible = false,
  delay = 0,
  cardId = '',
}) => {
  const [animatedLetters, setAnimatedLetters] = useState<
    Array<{
      char: string
      isSpace: boolean
      isLineBreak: boolean
      delay: number
    }>
  >([])
  const [cardOrigin, setCardOrigin] = useState({ originX: 0, originY: 0 })

  // 8-point clock positions around screen border
  const getRandomOrigin = (id: string) => {
    const positions = [
      { x: -100, y: -100 }, // top-left
      { x: 50, y: -100 }, // top
      { x: 200, y: -100 }, // top-right
      { x: 200, y: 50 }, // right
      { x: 200, y: 200 }, // bottom-right
      { x: 50, y: 200 }, // bottom
      { x: -100, y: 200 }, // bottom-left
      { x: -100, y: 50 }, // left
    ]

    // Use card ID to create consistent but seemingly random selection
    const hash = id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    const position = positions[Math.abs(hash) % positions.length]
    return {
      originX: position.x,
      originY: position.y,
    }
  }

  useEffect(() => {
    if (text && cardId) {
      const origin = getRandomOrigin(cardId)
      setCardOrigin(origin)

      const letters = text.split('').map((char, index) => {
        return {
          char,
          isSpace: char === ' ',
          isLineBreak: char === '\n',
          delay: index * 25 + Math.random() * 30, // Reduced staggering for smoother effect
        }
      })
      setAnimatedLetters(letters)
    }
  }, [text, cardId])

  return (
    <span className={`inline ${className}`}>
      {animatedLetters.map((letter, index) => {
        if (letter.isLineBreak) {
          return <br key={index} />
        }

        return (
          <span
            key={index}
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible
                ? 'translateX(0) translateY(0) scale(1) rotate(0deg)'
                : `translateX(${cardOrigin.originX}vw) translateY(${cardOrigin.originY}vh) scale(0.3) rotate(${
                    Math.random() * 720 - 360
                  }deg)`,
              opacity: isVisible ? 1 : 0,
              transitionDelay: isVisible ? `${delay + letter.delay}ms` : '0ms',
              filter: isVisible ? 'blur(0px)' : 'blur(3px)',
              marginRight: letter.isSpace ? '0.25em' : '0',
            }}
          >
            {letter.isSpace ? '\u00A0' : letter.char}
          </span>
        )
      })}
    </span>
  )
}

export default AnimatedText
