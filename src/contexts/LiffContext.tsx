"use client";
import { initLiff } from "@/libs/liff";
import liff, { Liff } from "@line/liff";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
interface LiffContextType {
  liff: typeof liff | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const LiffContext = createContext<LiffContextType>({
  liff: null,
  isInitialized: false,
  isLoading: false,
  error: null,
});

export const LiffProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("start initializing liff.");
    startTransition(async () => {
      try {
        const liffInstance = await initLiff();
        setLiffObject(liffInstance);
        setIsInitialized(true);
      } catch (error) {
        setError(error as Error);
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      liff: liffObject,
      isInitialized,
      isLoading: isPending,
      error,
    }),
    [liffObject, isInitialized, isPending, error]
  );

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
};
export const useLiff = (): LiffContextType => {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};
