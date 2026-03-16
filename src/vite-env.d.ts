/// <reference types="vite/client" />

// Extend ImportMeta to include Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_ prefixed vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
