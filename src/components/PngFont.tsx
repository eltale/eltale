import { useMemo, useState, useEffect } from 'react'

interface PngFontProps {
  text: string
  className?: string
  letterClassName?: string
}

// Import all letter images
const letterImages = {
  '1': () => import('../assets/letters/300dpi_1.png'),
  '2': () => import('../assets/letters/300dpi_2.png'),
  '3': () => import('../assets/letters/300dpi_3.png'),
  '4': () => import('../assets/letters/300dpi_4.png'),
  '5': () => import('../assets/letters/300dpi_5.png'),
  '6': () => import('../assets/letters/300dpi_6.png'),
  '7': () => import('../assets/letters/300dpi_7.png'),
  '8': () => import('../assets/letters/300dpi_8.png'),
  '9': () => import('../assets/letters/300dpi_9.png'),
  'A': () => import('../assets/letters/300dpi_A.png'),
  'B': () => import('../assets/letters/300dpi_B.png'),
  'C': () => import('../assets/letters/300dpi_C.png'),
  'D': () => import('../assets/letters/300dpi_D.png'),
  'E': () => import('../assets/letters/300dpi_E.png'),
  'F': () => import('../assets/letters/300dpi_F.png'),
  'G': () => import('../assets/letters/300dpi_G.png'),
  'H': () => import('../assets/letters/300dpi_H.png'),
  'I': () => import('../assets/letters/300dpi_I.png'),
  'J': () => import('../assets/letters/300dpi_J.png'),
  'K': () => import('../assets/letters/300dpi_K.png'),
  'L': () => import('../assets/letters/300dpi_L.png'),
  'M': () => import('../assets/letters/300dpi_M.png'),
  'N': () => import('../assets/letters/300dpi_N.png'),
  'O': () => import('../assets/letters/300dpi_O.png'),
  'P': () => import('../assets/letters/300dpi_P.png'),
  'Q': () => import('../assets/letters/300dpi_Q.png'),
  'R': () => import('../assets/letters/300dpi_R.png'),
  'S': () => import('../assets/letters/300dpi_S.png'),
  'T': () => import('../assets/letters/300dpi_T.png'),
  'U': () => import('../assets/letters/300dpi_U.png'),
  'V': () => import('../assets/letters/300dpi_V.png'),
  'W': () => import('../assets/letters/300dpi_W.png'),
  'X': () => import('../assets/letters/300dpi_X.png'),
  'Y': () => import('../assets/letters/300dpi_Y.png'),
  'Z': () => import('../assets/letters/300dpi_Z.png'),
}

interface LetterProps {
  char: string
  className?: string
}

function PngLetter({ char, className }: LetterProps) {
  const upperChar = char.toUpperCase() as keyof typeof letterImages
  
  // Handle spaces and unsupported characters
  if (char === ' ') {
    return <span className="inline-block w-4" />
  }
  
  if (!letterImages[upperChar]) {
    return <span className={`inline-block ${className || ''}`}>{char}</span>
  }

  const [imageSrc, setImageSrc] = useState<string>('')

  useEffect(() => {
    letterImages[upperChar]().then((module: any) => {
      setImageSrc(module.default)
    })
  }, [upperChar])

  if (!imageSrc) return <span className="inline-block w-8 h-8" />

  return (
    <img
      src={imageSrc}
      alt={char}
      className={`inline-block ${className || 'h-8 w-auto'}`}
      style={{ imageRendering: 'crisp-edges' }}
    />
  )
}

export default function PngFont({ text, className = '', letterClassName }: PngFontProps) {
  const letters = useMemo(() => {
    return text.split('').map((char, index) => (
      <PngLetter
        key={`${char}-${index}`}
        char={char}
        className={letterClassName}
      />
    ))
  }, [text, letterClassName])

  return (
    <div className={`inline-flex flex-wrap items-baseline ${className}`}>
      {letters}
    </div>
  )
}