interface ImportMetaEnv {
  readonly PUBLIC_PLAUSIBLE_ENDPOINT: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
