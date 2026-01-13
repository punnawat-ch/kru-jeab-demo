"use client";
import { useLiff } from "@/contexts/LiffContext";
import Loading from "@/components/Loading";
import ProfileCard from "@/components/ProfileCard";
import LoginPage from "@/components/LoginPage";

export default function Home() {
  const { liff, isLoading, isInitialized, error } = useLiff();

  // Show loading screen while initializing
  if (isLoading || !isInitialized) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => globalThis.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Show login page if not logged in
  if (!liff?.isLoggedIn()) {
    return liff ? <LoginPage liff={liff} /> : null;
  }

  // Show main content (Profile) when logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 animate-float">
          👋 สวัสดี!
        </h1>
        <p className="text-blue-600 text-lg">
          ยินดีต้อนรับสู่{" "}
          <span className="font-bold">ครูเจี๊ยบ (Kru Jeab)</span>
        </p>
      </div>

      {/* Profile Card */}
      {liff && <ProfileCard liff={liff} />}

      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200 rounded-full opacity-20 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-sky-200 rounded-full opacity-15 blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}
