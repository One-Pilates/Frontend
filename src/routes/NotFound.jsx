import { useState } from 'react';

export default function NotFound() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="text-center z-10 max-w-2xl">
        <div className="relative mb-8">
          <h1 className="text-[160px] md:text-[220px] font-black leading-none select-none relative">
            <span className="absolute inset-0 text-orange-500 opacity-20 blur-2xl scale-110">
              404
            </span>
            <span className="absolute inset-0 text-orange-400 opacity-30 blur-xl">404</span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
              404
            </span>
          </h1>
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Página não encontrada
          </h2>
          <p className="text-lg text-gray-600 dark:text-fontSec max-w-md mx-auto leading-relaxed">
            Esta página não existe no nosso estúdio. Que tal voltar e explorar nossas aulas de
            Pilates?
          </p>
        </div>

        <div className="mb-10 flex justify-center gap-3">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full"
              style={{
                animation: `bounce 1s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <svg
            className={`w-6 h-6 relative z-10 transition-transform duration-300 ${isHovering ? '-translate-x-1' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>

          <span className="relative z-10">Voltar</span>
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
