import React, { useEffect, useState } from 'react';

const LoadingSpinner = ({ delay = 400, message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    const hideTimer = setTimeout(() => setShow(false), delay);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [delay]);

  return (
    <div 
      className={`
        absolute inset-0 
        flex flex-col items-center justify-center gap-4 
        z-999 
        backdrop-blur-md
        transition-all duration-400 ease-in-out
        ${show 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }
      `}
    >
      <style>{`
        @keyframes spin-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-border {
          animation: spin-border 0.8s linear infinite;
        }
      `}</style>
      
      {message && (
        <p 
          className="text-sm font-semibold"
          style={{ color: 'var(--text-escuro)' }}
        >
          {message}
        </p>
      )}

      <div className="relative w-12 h-12">
        <div 
          className="spinner-border absolute inset-0 rounded-full border-4 border-transparent"
          style={{ 
            borderTopColor: 'var(--laranja-principal)',
            borderRightColor: 'var(--laranja-principal)'
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
