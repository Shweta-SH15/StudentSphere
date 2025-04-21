
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { heart, x } from "lucide-react";

interface SwipeCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  details: React.ReactNode;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  id,
  image,
  title,
  subtitle,
  details,
  onLike,
  onDislike,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    setSwipeDirection(diff > 0 ? "right" : "left");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    setSwipeDirection(diff > 0 ? "right" : "left");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(offsetX) > 100) {
      // Sufficient swipe distance
      if (offsetX > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    } else {
      // Reset position
      setOffsetX(0);
      setSwipeDirection(null);
    }
  };

  const handleLike = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      onLike(id);
      reset();
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      onDislike(id);
      reset();
    }, 300);
  };

  const reset = () => {
    setOffsetX(0);
    setSwipeDirection(null);
  };

  const rotation = offsetX / 20; // For slight rotation effect

  return (
    <div className="relative mx-auto max-w-sm w-full">
      <div
        ref={cardRef}
        className={`relative ${swipeDirection === "right" ? "animate-swipe-right" : swipeDirection === "left" ? "animate-swipe-left" : ""}`}
        style={{
          transform: isDragging ? `translateX(${offsetX}px) rotate(${rotation}deg)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={isDragging ? handleDragEnd : undefined}
      >
        <Card className="overflow-hidden">
          <div className="h-64 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            {subtitle && <p className="text-gray-500 text-sm mb-2">{subtitle}</p>}
            <div className="mt-2">{details}</div>
          </div>
        </Card>

        {/* Swipe indicators */}
        {swipeDirection === "right" && (
          <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 transform rotate-12">
            LIKE
          </div>
        )}
        {swipeDirection === "left" && (
          <div className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-2 transform -rotate-12">
            NOPE
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-8 mt-4">
        <Button 
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleDislike}
        >
          <x className="h-6 w-6" />
        </Button>

        <Button 
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-green-300 text-green-500 hover:bg-green-50 hover:text-green-600"
          onClick={handleLike}
        >
          <heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
