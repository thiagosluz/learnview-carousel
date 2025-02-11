
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
  type: 'text' | 'image' | 'video';
  content: string;
  title?: string;
  duration?: number;
}

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
    return item.duration || (item.type === 'video' ? 30 : 10);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setProgress(0);
  };

  useEffect(() => {
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

  const renderContent = () => {
    const item = items[currentIndex];

    switch (item.type) {
      case 'text':
        return (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            {item.title && (
              <h2 className="text-4xl font-display font-bold mb-6">{item.title}</h2>
            )}
            <p className="text-2xl leading-relaxed">{item.content}</p>
          </div>
        );
      case 'image':
        return (
          <img
            src={item.content}
            alt={item.title || ''}
            className="w-full h-full object-cover"
          />
        );
      case 'video':
        return (
          <video
            ref={videoRef}
            src={item.content}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[30vh] bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="absolute inset-0 animate-fade-in">{renderContent()}</div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default NewsCarousel;
