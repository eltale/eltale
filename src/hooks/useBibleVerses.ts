import { useEffect, useState } from 'react'

interface BibleVerse {
  id: string
  text: string
  reference: string
  book: string
  chapter: number
  verse: number
}

interface WEBVerseData {
  type: string
  chapterNumber: number
  verseNumber: number
  sectionNumber?: number
  value: string
}

const BIBLE_BOOKS = [
  { name: 'Genesis', filename: 'genesis' },
  { name: 'Exodus', filename: 'exodus' },
  { name: 'Leviticus', filename: 'leviticus' },
  { name: 'Numbers', filename: 'numbers' },
  { name: 'Deuteronomy', filename: 'deuteronomy' },
  { name: 'Joshua', filename: 'joshua' },
  { name: 'Judges', filename: 'judges' },
  { name: 'Ruth', filename: 'ruth' },
  { name: '1 Samuel', filename: '1samuel' },
  { name: '2 Samuel', filename: '2samuel' },
  { name: '1 Kings', filename: '1kings' },
  { name: '2 Kings', filename: '2kings' },
  { name: '1 Chronicles', filename: '1chronicles' },
  { name: '2 Chronicles', filename: '2chronicles' },
  { name: 'Ezra', filename: 'ezra' },
  { name: 'Nehemiah', filename: 'nehemiah' },
  { name: 'Esther', filename: 'esther' },
  { name: 'Job', filename: 'job' },
  { name: 'Psalms', filename: 'psalms' },
  { name: 'Proverbs', filename: 'proverbs' },
  { name: 'Ecclesiastes', filename: 'ecclesiastes' },
  { name: 'Song of Solomon', filename: 'songofsolomon' },
  { name: 'Isaiah', filename: 'isaiah' },
  { name: 'Jeremiah', filename: 'jeremiah' },
  { name: 'Lamentations', filename: 'lamentations' },
  { name: 'Ezekiel', filename: 'ezekiel' },
  { name: 'Daniel', filename: 'daniel' },
  { name: 'Hosea', filename: 'hosea' },
  { name: 'Joel', filename: 'joel' },
  { name: 'Amos', filename: 'amos' },
  { name: 'Obadiah', filename: 'obadiah' },
  { name: 'Jonah', filename: 'jonah' },
  { name: 'Micah', filename: 'micah' },
  { name: 'Nahum', filename: 'nahum' },
  { name: 'Habakkuk', filename: 'habakkuk' },
  { name: 'Zephaniah', filename: 'zephaniah' },
  { name: 'Haggai', filename: 'haggai' },
  { name: 'Zechariah', filename: 'zechariah' },
  { name: 'Malachi', filename: 'malachi' },
  { name: 'Matthew', filename: 'matthew' },
  { name: 'Mark', filename: 'mark' },
  { name: 'Luke', filename: 'luke' },
  { name: 'John', filename: 'john' },
  { name: 'Acts', filename: 'acts' },
  { name: 'Romans', filename: 'romans' },
  { name: '1 Corinthians', filename: '1corinthians' },
  { name: '2 Corinthians', filename: '2corinthians' },
  { name: 'Galatians', filename: 'galatians' },
  { name: 'Ephesians', filename: 'ephesians' },
  { name: 'Philippians', filename: 'philippians' },
  { name: 'Colossians', filename: 'colossians' },
  { name: '1 Thessalonians', filename: '1thessalonians' },
  { name: '2 Thessalonians', filename: '2thessalonians' },
  { name: '1 Timothy', filename: '1timothy' },
  { name: '2 Timothy', filename: '2timothy' },
  { name: 'Titus', filename: 'titus' },
  { name: 'Philemon', filename: 'philemon' },
  { name: 'Hebrews', filename: 'hebrews' },
  { name: 'James', filename: 'james' },
  { name: '1 Peter', filename: '1peter' },
  { name: '2 Peter', filename: '2peter' },
  { name: '1 John', filename: '1john' },
  { name: '2 John', filename: '2john' },
  { name: '3 John', filename: '3john' },
  { name: 'Jude', filename: 'jude' },
  { name: 'Revelation', filename: 'revelation' },
]

export function useBibleVerses() {
  const [verses, setVerses] = useState<BibleVerse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRandomVerse = async (): Promise<BibleVerse | null> => {
    try {
      setLoading(true)
      setError(null)

      const randomBook = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)]
      const response = await fetch(
        `https://raw.githubusercontent.com/TehShrike/world-english-bible/master/json/${randomBook.filename}.json`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch verse')
      }

      const data: WEBVerseData[] = await response.json()

      // Filter for actual verse content (paragraph text or line text)
      const verseData = data.filter(
        item =>
          (item.type === 'paragraph text' || item.type === 'line text') && item.value && item.value.trim().length > 0,
      )

      if (verseData.length > 0) {
        const randomVerse = verseData[Math.floor(Math.random() * verseData.length)]

        // Clean up the text (remove extra spaces)
        const cleanText = randomVerse.value.trim().replace(/\s+/g, ' ')

        return {
          id: `${randomBook.name}-${randomVerse.chapterNumber}-${randomVerse.verseNumber}-${Date.now()}`,
          text: cleanText,
          reference: `${randomBook.name} ${randomVerse.chapterNumber}:${randomVerse.verseNumber}`,
          book: randomBook.name,
          chapter: randomVerse.chapterNumber,
          verse: randomVerse.verseNumber,
        }
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  const loadNextVerse = async (): Promise<BibleVerse | null> => {
    const newVerse = await fetchRandomVerse()
    if (newVerse) {
      setVerses(prev => [...prev, newVerse])
      return newVerse
    }
    return null
  }

  useEffect(() => {
    loadNextVerse()
  }, [])

  return {
    verses,
    loading,
    error,
    loadNextVerse,
  }
}
