import { siteOrigin } from "../../scripts/site-config.mjs";

export const APP_NAME = "Tinta";
export const APP_TAGLINE = "Hungarian field notes";
export const APP_DESCRIPTION =
  "Hungarian field notes for English speakers — grammar, cases, verbs, and the words you will actually use.";
export const APP_MEANING = "tinta, ink";
export const REPO_URL = "https://github.com/rntschlr/tintas";
export const SUPPORT_EMAIL = "johnkrentschler@icloud.com";
export const THEME_COLOR = "#F4EFE4";
/** Canonical public origin. Override with VITE_PUBLIC_SITE_URL when changing domains. */
export const SITE_ORIGIN = siteOrigin(import.meta.env?.VITE_PUBLIC_SITE_URL);
