import SplashScreen from './components/SplashScreen'
import VerseViewer from './components/VerseViewer'

function App() {
  return (
    <div className="font-medieval h-screen w-full">
      <VerseViewer showSplash={true} />
    </div>
  )
}

export default App
