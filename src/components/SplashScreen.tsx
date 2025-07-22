interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <div 
      className="h-screen w-full bg-gradient-to-b from-brown-dark via-red-dark to-burgundy flex items-center justify-center cursor-pointer"
      onClick={onComplete}
    >
      <div className="text-center animate-pulse">
        <h1 className="font-medieval text-8xl text-gold drop-shadow-2xl mb-4 tracking-widest">
          El Tale
        </h1>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        <p className="font-medieval text-cream/80 text-lg mt-6 tracking-wide">
          Tap to Enter
        </p>
      </div>
    </div>
  );
}