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
  const [animatedWords, setAnimatedWords] = useState<
    Array<{
      word: string
      letters: Array<{
        char: string
        delay: number
      }>
      wordDelay: number
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

      // Split by words first, then letters within each word
      const words = text.split(/\s+/).filter(word => word.length > 0)
      let globalLetterIndex = 0

      const processedWords = words.map((word, wordIndex) => {
        const letters = word.split('').map((char, letterIndex) => {
          const letterDelay = globalLetterIndex * 20 + Math.random() * 25
          globalLetterIndex++
          return {
            char,
            delay: letterDelay,
          }
        })

        return {
          word,
          letters,
          wordDelay: wordIndex * 50, // Slight word-level stagger
        }
      })

      setAnimatedWords(processedWords)
    }
  }, [text, cardId])

  return (
    <span className={`${className}`}>
      {animatedWords.map((wordObj, wordIndex) => (
        <React.Fragment key={wordIndex}>
          {/* Add space before word (except first word) */}
          {wordIndex > 0 && (
            <span
              className="inline-block transition-all duration-1000 ease-out"
              style={{
                transform: isVisible
                  ? 'translateX(0) translateY(0) scale(1)'
                  : `translateX(${cardOrigin.originX}vw) translateY(${cardOrigin.originY}vh) scale(0.3)`,
                opacity: isVisible ? 1 : 0,
                transitionDelay: isVisible ? `${delay + wordObj.wordDelay - 25}ms` : '0ms',
                filter: isVisible ? 'blur(0px)' : 'blur(3px)',
              }}
            >
              {'\u00A0'}
            </span>
          )}

          {/* Render each letter in the word */}
          {wordObj.letters.map((letter, letterIndex) => (
            <span
              key={`${wordIndex}-${letterIndex}`}
              className="inline-block transition-all duration-[3s] ease-out"
              style={{
                transform: isVisible
                  ? 'translateX(0) translateY(0) scale(1) rotate(0deg)'
                  : `translateX(${cardOrigin.originX}vw) translateY(${cardOrigin.originY}vh) scale(0.3) rotate(${
                      Math.random() * 720 - 360
                    }deg)`,
                opacity: isVisible ? 1 : 0,
                transitionDelay: isVisible ? `${delay + letter.delay}ms` : '0ms',
                filter: isVisible ? 'blur(0px)' : 'blur(3px)',
              }}
            >
              {letter.char}
            </span>
          ))}
        </React.Fragment>
      ))}
    </span>
  )
}

export default AnimatedText
