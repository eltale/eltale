import { Howl } from 'howler'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import sound__text from '../assets/letter.wav'

const random = Math.random
const randomPick = <T = any,>(arr: readonly T[]) => arr[~~(random() * arr.length)] as T

const textSound = new Howl({ src: sound__text, volume: 0.2, preload: true })

type AnimatedTextProps = {
  children: string
  onStart?: () => void
  onComplete?: () => void
  shouldAnimate?: boolean
}

function AnimatedText({ children: text, onStart, onComplete, shouldAnimate = true }: AnimatedTextProps) {
  const words = text.split(/\s/)
  const [show, setShow] = useState(false)
  const [animating, setAnimating] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)
  const uniqueTextHash = useMemo(() => `${random()}`, [])

  // Calculate font size based on text length
  const fontSize = useMemo(() => {
    const fontSizes = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm']
    const textLength = text.length
    
    // Define length thresholds for each font size (much higher ceiling)
    const thresholds = [200, 350, 500, 650, 800, 1000] // characters
    
    let sizeIndex = 0
    for (let i = 0; i < thresholds.length; i++) {
      if (textLength > thresholds[i]) {
        sizeIndex = i + 1
      } else {
        break
      }
    }
    
    return fontSizes[Math.min(sizeIndex, fontSizes.length - 1)]
  }, [text])

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      setShow(true)
    } else if (hasAnimated) {
      setShow(true)
      setAnimating(false)
    } else {
      setShow(false)
      setAnimating(true)
    }
  }, [shouldAnimate, hasAnimated])

  useEffect(() => {
    if (animating) onStart?.()
    else onComplete?.()
  }, [animating]) // eslint-disable-line react-hooks/exhaustive-deps

  const disableAnimation = () => {
    setAnimating(false)
    setHasAnimated(true)
  }

  const randomX = randomPick([0, '50%', '100%'])
  const randomY = randomPick([0, '50%', '100%'])

  const elText = (
    <div className={fontSize}>
      {words.map((word, w) => {
        const letters = word.split('')

        return (
          <Fragment key={`${w}`}>
            {w > 0 && ' '}

            <div className="inline-block origin-center">
              {letters.map((letter, l) => {
                const elLetter = (
                  <div
                    className={`inline-block ${!show && 'absolute -translate-x-1/2 -translate-y-1/2 opacity-0'}`}
                    style={{
                      left: show ? undefined : randomX,
                      top: show ? undefined : randomY,
                    }}
                  >
                    {letter}
                  </div>
                )

                const animatedOrStaticLetter = animating ? (
                  <Flipped
                    flipId={`Animatedtext-${w}-${l}-salt-${uniqueTextHash}`}
                    stagger
                    onStart={() => textSound.play()}
                  >
                    {elLetter}
                  </Flipped>
                ) : (
                  elLetter
                )

                return <Fragment key={`${l}`}>{animatedOrStaticLetter}</Fragment>
              })}
            </div>
          </Fragment>
        )
      })}
    </div>
  )

  const animatedOrStaticText = animating ? (
    <Flipper
      flipKey={`show=${show};text=${text}`}
      staggerConfig={{ default: { speed: 0.2 } }}
      spring="gentle"
      onComplete={disableAnimation}
    >
      {elText}
    </Flipper>
  ) : (
    elText
  )

  return animatedOrStaticText
}

export default AnimatedText
