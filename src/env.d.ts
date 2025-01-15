interface ImportMetaEnv {
  readonly PUBLIC_PLAUSIBLE_URL: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
