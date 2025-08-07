import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Loading...', 
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`${sizeClasses[size]} animate-spin text-green-600`} 
        />
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Inline loading spinner for buttons
export const ButtonSpinner = ({ size = 'small', className = '' }) => (
  <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
);

// Page loading spinner
export const PageLoader = ({ text = 'Loading page...' }) => (
  <LoadingSpinner size="large" text={text} fullScreen />
);

// Section loading spinner
export const SectionLoader = ({ text = 'Loading...', className = '' }) => (
  <div className={`min-h-[200px] ${className}`}>
    <LoadingSpinner size="default" text={text} />
  </div>
);

const sizeClasses = {
  small: 'w-4 h-4',
  default: 'w-8 h-8',
  large: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export default LoadingSpinner;
