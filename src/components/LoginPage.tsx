"use client";

import { Liff } from "@line/liff";

interface LoginPageProps {
  readonly liff: Liff;
}

export default function LoginPage({ liff }: LoginPageProps) {
  const handleLogin = () => {
    if (liff) {
      liff.login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-200 rounded-full opacity-25 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-sky-200 rounded-full opacity-20 blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 text-4xl animate-bounce"
          style={{ animationDelay: "0s" }}
        >
          🌟
        </div>
        <div
          className="absolute top-1/3 right-1/4 text-3xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 text-4xl animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          💫
        </div>
        <div
          className="absolute bottom-1/3 right-1/3 text-3xl animate-bounce"
          style={{ animationDelay: "1.5s" }}
        >
          ⭐
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-md w-full">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>

        <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-8 md:p-10 border-4 border-blue-200">
          {/* Logo/Icon Section */}
          <div className="text-center mb-8">
            <div className="inline-block relative mb-4">
              {/* Animated circle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-5xl shadow-lg transform hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              {/* Decorative rings */}
              <div className="absolute -inset-2 border-4 border-blue-300 rounded-full animate-ping opacity-30"></div>
              <div className="absolute -inset-4 border-2 border-cyan-300 rounded-full animate-pulse opacity-20"></div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
              ครูเจี๊ยบ
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-1">Kru Jeab</p>
            <div className="inline-block mt-2 px-4 py-1 bg-blue-100 rounded-full">
              <p className="text-sm text-blue-700 font-medium">
                Line LIFF Application
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8 space-y-3">
            <p className="text-lg text-gray-700 leading-relaxed">
              ยินดีต้อนรับสู่แอปพลิเคชัน
              <br />
              <span className="font-bold text-blue-600">ครูเจี๊ยบ</span>
            </p>
            <p className="text-sm text-gray-600">
              กรุณาเข้าสู่ระบบผ่าน Line เพื่อใช้งาน
            </p>
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button content */}
              <div className="relative flex items-center justify-center gap-3">
                <span className="text-2xl">🔐</span>
                <span className="text-lg">เข้าสู่ระบบด้วย Line</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </button>

            {/* Info text */}
            <p className="text-center text-xs text-gray-500 mt-4">
              การเข้าสู่ระบบจะเปิดในหน้าต่างใหม่
            </p>
          </div>

          {/* Decorative bottom elements */}
          <div className="flex justify-center gap-2 mt-8">
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-2xl opacity-30">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            📚
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>
            ✏️
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>
            📝
          </span>
        </div>
      </div>
    </div>
  );
}
