
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '@/types';

interface NewsCarouselProps {
  items: NewsItem[];
}

const NewsCarousel = ({ items }: NewsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const getCurrentDuration = () => {
    const item = items[currentIndex];
    return item?.duration || 10;
  };

  const nextSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setProgress(0);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setProgress(0);
  };

  useEffect(() => {
    if (items.length === 0) return;
    
    const duration = getCurrentDuration() * 1000;
    const interval = duration / 100;

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 1;
      });
    }, interval);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, items]);

  if (items.length === 0) {
    return (
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
        <p className="text-xl text-gray-500">Nenhuma notícia disponível</p>
      </div>
    );
  }

  const renderContent = () => {
    const item = items[currentIndex];

    switch (item.type) {
      case 'text':
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center bg-gradient-to-br from-primary/5 to-accent/20">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 md:mb-6 text-gray-900">{item.title}</h2>
            <p className="text-lg md:text-2xl leading-relaxed text-gray-700">{item.content}</p>
          </div>
        );
      case 'image':
        return (
          <div className="relative h-full">
            <img
              src={item.content}
              alt={item.title}
              className="w-full h-full object-contain md:object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/60 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold text-white">{item.title}</h2>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="absolute inset-0 animate-fade-in">{renderContent()}</div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default NewsCarousel;
