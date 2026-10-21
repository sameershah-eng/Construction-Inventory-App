import React, { useState } from 'react';
import { Package, Wrench, Truck } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackInitials?: string;
  category?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackInitials,
  category
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive initials from alt or name if not provided
  const initials =
    fallbackInitials ||
    alt
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  const getCategoryIcon = () => {
    switch (category) {
      case 'parts':
      case 'consumables':
        return <Package className="w-5 h-5 text-concrete stroke-[1.5]" />;
      case 'equipment':
        return <Wrench className="w-5 h-5 text-concrete stroke-[1.5]" />;
      default:
        return <Truck className="w-5 h-5 text-concrete stroke-[1.5]" />;
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`bg-[#2E3033] flex flex-col items-center justify-center text-white/80 select-none overflow-hidden ${className}`}
        title={alt}
      >
        <div className="flex items-center justify-center mb-1">
          {getCategoryIcon()}
        </div>
        <span className="text-[11px] font-semibold tracking-wider text-slate-300">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#2E3033] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#2E3033] flex items-center justify-center animate-pulse">
          <span className="text-[10px] text-slate-400 font-medium">{initials}</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
