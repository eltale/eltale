interface BibleVerse {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

interface VerseCardProps {
  verse: BibleVerse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-brown-dark via-burgundy to-red-dark flex flex-col justify-center items-center p-8 relative overflow-hidden">
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
          "{verse.text}"
        </blockquote>
        
        <div className="space-y-2">
          <div className="w-24 h-0.5 bg-gold mx-auto"></div>
          <cite className="font-medieval text-xl md:text-2xl text-gold-dark tracking-widest block">
            {verse.reference}
          </cite>
        </div>
      </div>
      
      {/* Bottom ornament */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-cream/60">
        <div className="w-0.5 h-8 bg-gradient-to-t from-cream/60 to-transparent mb-2"></div>
        <p className="font-medieval text-sm tracking-wide">Swipe up for next verse</p>
      </div>
    </div>
  );
}