"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100">
      <div className="relative">
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-300 border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-sky-300 border-t-sky-400 rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
        </div>
      </div>
      
      {/* Loading text with animation */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-blue-600 animate-pulse">
          กำลังโหลด...
        </h2>
        <p className="mt-2 text-blue-500 text-sm">
          กรุณารอสักครู่
        </p>
      </div>

      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-cyan-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-sky-300 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.3s' }}></div>
      </div>
    </div>
  );
}

