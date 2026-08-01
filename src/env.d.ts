import { WEBMENTION_API_KEY } from '../.astro/env';
declare module "@pagefind/default-ui" {
  declare class PagefindUI {
    constructor(arg: unknown);
  }
}

interface ImportMetaEnv {
  readonly WEBMENTION_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}