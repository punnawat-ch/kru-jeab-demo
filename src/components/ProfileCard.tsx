"use client";

import { useState, useEffect } from "react";
import { Liff } from "@line/liff";

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  email?: string;
}

interface ProfileCardProps {
  readonly liff: Liff;
}

export default function ProfileCard({ liff }: ProfileCardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!liff?.isLoggedIn()) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    liff
      .getProfile()
      .then((profileData) => {
        setProfile(profileData as Profile);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting profile:", error);
        setLoading(false);
      });
  }, [liff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูล Profile ได้</p>
        {!liff.isLoggedIn() && (
          <button
            onClick={() => liff.login()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-500 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.02] hover:shadow-3xl border-4 border-blue-200">
        {/* Floating decorative stars */}
        <div
          className="absolute top-4 right-4 text-2xl animate-bounce"
          style={{ animationDelay: "0s" }}
        >
          ⭐
        </div>
        <div
          className="absolute top-8 left-4 text-xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-20 right-8 text-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          💫
        </div>

        {/* Sparkle effects */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-ping"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Header with decorative elements */}
        <div className="relative mb-8">
          {/* Animated background circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-40 blur-2xl animate-pulse"></div>
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-cyan-300 to-sky-300 rounded-full opacity-30 blur-xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>

          {/* Profile Picture with multiple animated rings */}
          <div className="relative mx-auto w-40 h-40 mb-6">
            {/* Outer animated ring */}
            <div
              className="absolute -inset-4 border-4 border-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>

            {/* Middle ring */}
            <div className="absolute -inset-2 border-4 border-blue-300 rounded-full animate-pulse opacity-70"></div>

            {/* Profile picture container */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-400 rounded-full p-1.5 shadow-lg">
                <div className="w-full h-full bg-white rounded-full p-1">
                  <img
                    src={profile.pictureUrl || "/default-avatar.png"}
                    alt={profile.displayName}
                    className="w-full h-full rounded-full object-cover shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
            <div
              className="absolute -top-2 -right-2 w-6 h-6 bg-pink-300 rounded-full animate-bounce opacity-80"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-300 rounded-full animate-bounce opacity-80"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-300 rounded-full animate-bounce opacity-80"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center space-y-6 relative z-10">
          {/* Name with gradient text */}
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3 animate-pulse">
              {profile.displayName || "ไม่ระบุชื่อ"}
            </h1>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
          </div>

          {/* Status Message */}
          {profile.statusMessage && (
            <div className="relative bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 border-2 border-blue-200 shadow-inner">
              <p className="text-blue-700 italic text-base font-medium">
                &ldquo;{profile.statusMessage}&rdquo;
              </p>
              <div className="absolute -top-2 left-4 text-xl">💭</div>
              <div className="absolute -bottom-2 right-4 text-xl">💭</div>
            </div>
          )}

          {/* Email Card */}
          {profile.email && (
            <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-5 border-4 border-blue-300 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📧</span>
                <div className="flex-1 text-left">
                  <div className="text-blue-600 font-semibold text-sm mb-1">
                    Email
                  </div>
                  <div className="text-gray-700 text-sm font-medium truncate">
                    {profile.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fun decorative elements */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="flex gap-2">
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-sky-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div
              className="text-2xl animate-bounce"
              style={{ animationDelay: "0.3s" }}
            >
              🎉
            </div>
            <div className="flex gap-2">
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="w-3 h-3 bg-sky-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
