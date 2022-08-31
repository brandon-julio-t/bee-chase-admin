declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_BASE_PATH: string;
      BLUEJACK_API_URL: string;
    }
  }
}

export {};
