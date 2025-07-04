import React from 'react';

interface FancyLoadingProps {
  variant?: 'pulse' | 'dots' | 'spinner' | 'wave';
  color?: string;
  text?: string;
}

export default function FancyLoading({
  variant = 'pulse',
  color = 'text-blue-600',
  text = 'Memuat...'
}: FancyLoadingProps) {
  
  const renderLoadingVariant = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className="flex space-x-2">
            <div className={`h-3 w-3 rounded-full ${color} animate-pulse`}></div>
            <div className={`h-3 w-3 rounded-full ${color} animate-pulse delay-100`}></div>
            <div className={`h-3 w-3 rounded-full ${color} animate-pulse delay-200`}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`h-2 w-2 rounded-full ${color} animate-bounce`}></div>
            <div className={`h-2 w-2 rounded-full ${color} animate-bounce delay-100`}></div>
            <div className={`h-2 w-2 rounded-full ${color} animate-bounce delay-200`}></div>
            <div className={`h-2 w-2 rounded-full ${color} animate-bounce delay-300`}></div>
            <div className={`h-2 w-2 rounded-full ${color} animate-bounce delay-400`}></div>
          </div>
        );
      
      case 'spinner':
        return (
          <div className="relative h-12 w-12">
            <div className={`absolute h-12 w-12 rounded-full border-4 border-t-transparent ${color.replace('text', 'border')} animate-spin`}></div>
            <div className={`absolute h-12 w-12 rounded-full border-4 border-transparent border-b-${color.split('-')[1]} animate-spin animate-duration-1000`} style={{ animationDirection: 'reverse' }}></div>
          </div>
        );
      
      case 'wave':
        return (
          <div className="flex items-end space-x-1 h-8">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 ${color} animate-wave`} 
                style={{ 
                  height: `${Math.max(3, (i+1) * 4)}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className={`h-10 w-10 border-4 border-t-transparent ${color.replace('text', 'border')} rounded-full animate-spin`}></div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoadingVariant()}
      
      {text && (
        <p className={`mt-4 ${color} font-medium`}>{text}</p>
      )}
    </div>
  );
}