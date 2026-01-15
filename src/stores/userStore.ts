import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/generated/prisma/client";

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UserState {
  // State
  user: User | null;
  lineProfile: LineProfile | null;
  isRegistered: boolean;
  isNewUser: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLineProfile: (profile: LineProfile | null) => void;
  setIsRegistered: (isRegistered: boolean) => void;
  setIsNewUser: (isNewUser: boolean) => void;
  register: (user: User, isNewUser: boolean) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  lineProfile: null,
  isRegistered: false,
  isNewUser: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setLineProfile: (lineProfile) => set({ lineProfile }),

      setIsRegistered: (isRegistered) => set({ isRegistered }),

      setIsNewUser: (isNewUser) => set({ isNewUser }),

      register: (user, isNewUser) =>
        set({
          user,
          isRegistered: true,
          isNewUser,
        }),

      logout: () =>
        set({
          ...initialState,
        }),

      reset: () => set(initialState),
    }),
    {
      name: "kru-jeab-user",
      partialize: (state) => ({
        user: state.user,
        lineProfile: state.lineProfile,
        isRegistered: state.isRegistered,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useLineProfile = () => useUserStore((state) => state.lineProfile);
export const useIsRegistered = () =>
  useUserStore((state) => state.isRegistered);
export const useIsNewUser = () => useUserStore((state) => state.isNewUser);
