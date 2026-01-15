declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_LIFF_ID: string;
      NEXT_PUBLIC_LIFF_ID_TRANSACTIONS?: string;
      DATABASE_URL: string;
      LINE_CHANNEL_SECRET: string;
      LINE_CHANNEL_ACCESS_TOKEN: string;
    }
  }
}

export {};
