"use client";

import { useState, useEffect, useRef } from "react";
import { useLiff } from "@/contexts/LiffContext";
import { useUserStore } from "@/stores/userStore";
import Loading from "@/components/Loading";
import ProfileCard from "@/components/ProfileCard";
import LoginPage from "@/components/LoginPage";
import { registerUser } from "@/actions/register";
import { transactionsLiffId } from "@/configs";

type RegisterStatus = "idle" | "registering" | "success" | "error";
export default function Home() {
  const { liff, isLoading, isInitialized, error } = useLiff();
  const [registerStatus, setRegisterStatus] = useState<RegisterStatus>("idle");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const hasRegistered = useRef(false);
  const isLoggedIn = Boolean(liff?.isLoggedIn());

  // User store
  const { user, isNewUser, register, setLineProfile, reset } = useUserStore();

  // Mark as registered if already in store
  useEffect(() => {
    if (!user) return;
    hasRegistered.current = true;
  }, [user]);

  // Register user when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    if (!liff) return;
    if (user) return;
    if (registerStatus !== "idle") return;
    if (hasRegistered.current) return;

    hasRegistered.current = true;

    const registerAsync = async () => {
      setRegisterStatus("registering");

      try {
        const profile = await liff.getProfile();

        // Save LINE profile to store
        setLineProfile({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
        });

        const result = await registerUser({
          lineId: profile.userId,
          name: profile.displayName,
        });

        if (result.success && result.user) {
          // Save user to store
          register(result.user, result.isNewUser);
          setRegisterStatus("success");

          // แสดง welcome popup สำหรับ user ใหม่
          if (result.isNewUser) {
            setShowWelcome(true);
          }
        } else {
          setRegisterStatus("error");
          setRegisterError(result.error || "Registration failed");
        }
      } catch (err) {
        console.error("Registration failed:", err);
        setRegisterStatus("error");
        setRegisterError(
          err instanceof Error ? err.message : "Registration failed"
        );
      }
    };

    registerAsync();
  }, [isLoggedIn, liff, user, registerStatus, register, setLineProfile]);

  useEffect(() => {
    const referrer = new URLSearchParams(globalThis.location.search).get(
      "liff.referrer"
    );

    if (referrer === "transactions") {
      globalThis.location.replace("/transactions");
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    reset();
    liff?.logout();
    hasRegistered.current = false;
    setRegisterStatus("idle");
    setRegisterError(null);
  };

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
  if (!isLoggedIn) {
    return liff ? <LoginPage liff={liff} /> : null;
  }

  // Show registering state
  if (registerStatus === "registering") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-blue-600 mb-2">
            กำลังลงทะเบียน...
          </h2>
          <p className="text-gray-500">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  // Show registration error
  if (registerStatus === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            ลงทะเบียนไม่สำเร็จ
          </h2>
          <p className="text-gray-600 mb-4">
            {registerError || "เกิดข้อผิดพลาดในการลงทะเบียน"}
          </p>
          <button
            onClick={() => {
              hasRegistered.current = false;
              setRegisterStatus("idle");
              setRegisterError(null);
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Show main content (Profile) when logged in and registered
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 py-8 px-4">
      {/* Welcome Modal for new users */}
      {showWelcome && isNewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-bounce-in">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
              ยินดีต้อนรับ!
            </h2>
            <p className="text-gray-600 mb-2">
              สวัสดีคุณ{" "}
              <span className="font-bold text-blue-600">
                {user?.name || ""}
              </span>
            </p>
            <p className="text-gray-500 mb-6">
              คุณได้ลงทะเบียนเข้าสู่ระบบครูเจี๊ยบเรียบร้อยแล้ว 🎊
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
            >
              เริ่มต้นใช้งาน
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 animate-float">
          👋 สวัสดี!
        </h1>
        <p className="text-blue-600 text-lg">
          ยินดีต้อนรับสู่{" "}
          <span className="font-bold">ครูเจี๊ยบ (Kru Jeab)</span>
        </p>
        {user && (
          <p className="text-sm text-blue-500 mt-2">🆔 User ID: {user.id}</p>
        )}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              if (liff && transactionsLiffId) {
                const url = `https://liff.line.me/${transactionsLiffId}?liff.referrer=transactions`;
                liff.openWindow({ url, external: false });
                return;
              }
              globalThis.location.assign("/transactions");
            }}
            className="px-6 py-2 bg-white text-blue-600 rounded-full font-semibold border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            ดูรายการรายรับรายจ่าย
          </button>
        </div>
      </div>

      {/* Profile Card */}
      {liff && <ProfileCard liff={liff} />}

      {/* Logout Button */}
      <div className="max-w-md mx-auto mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
        >
          ออกจากระบบ
        </button>
      </div>

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
