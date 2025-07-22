import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import VerseViewer from './components/VerseViewer'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <div className="font-medieval h-screen w-full bg-black">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <VerseViewer />
      )}
    </div>
  )
}

export default App
