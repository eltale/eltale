export default function SplashScreen() {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-brown-dark via-red-dark to-burgundy flex flex-col justify-center items-center p-8 relative overflow-hidden snap-start snap-always">
      {/* Decorative medieval border elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-gold opacity-60"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-gold opacity-60"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-gold opacity-60"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-gold opacity-60"></div>
      
      {/* Central ornament */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      
      {/* Main content */}
      <div className="text-center relative z-10">
        <h1 className="font-medieval text-8xl text-gold drop-shadow-2xl mb-4 tracking-widest animate-pulse">
          El Tale
        </h1>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        <p className="font-medieval text-cream/80 text-xl mt-8 tracking-wide">
          Sacred Texts in Motion
        </p>
      </div>
      
      {/* Bottom ornament */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-cream/60 animate-pulse">
        <div className="w-0.5 h-8 bg-gradient-to-t from-cream/60 to-transparent mb-2"></div>
        <p className="font-medieval text-sm tracking-wide">Swipe for more verses</p>
      </div>
    </div>
  );
}