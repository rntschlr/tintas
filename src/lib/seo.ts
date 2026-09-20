import { APP_DESCRIPTION, APP_MEANING, APP_NAME, APP_TAGLINE, SITE_ORIGIN } from "@/lib/brand";

/** One ancestor in the breadcrumb trail. The current page is appended automatically. */
export type Crumb = { name: string; path: string };

/** A case sheet's headword, emitted as schema.org DefinedTerm. */
export type Term = {
  name: string;
  suffixes: string[];
  huName?: string;
  summary?: string;
};

export type PageKind = "home" | "lesson" | "page";

export type PageOptions = {
  /** "home" adds WebSite + Organization; "lesson" emits LearningResource. Default "page". */
  kind?: PageKind;
  /** Ancestors only, nearest-root first. Omit on the home page. */
  crumbs?: Crumb[];
  /** Case sheets only. */
  term?: Term;
  /** What a lesson teaches, for LearningResource.teaches. */
  teaches?: string;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonNode = { [key: string]: JsonValue };

const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const OG_IMAGE = `${SITE_ORIGIN}/og.jpg`;
const OG_IMAGE_ALT = `${APP_NAME} — ${APP_TAGLINE}`;

/**
 * "/cases/" -> "/cases", "" -> "/". match.pathname can carry a trailing slash
 * (cases.tsx guards for exactly that), and without this the canonical URL and
 * the sitemap disagree about the same page.
 */
function normalizePath(path: string): string {
  const clean = path.split(/[?#]/, 1)[0] ?? "/";
  const trimmed = clean.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function breadcrumbList(id: string, trail: Crumb[]): JsonNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_ORIGIN}${crumb.path}`,
    })),
  };
}

function definedTerm(id: string, term: Term): JsonNode {
  return {
    "@type": "DefinedTerm",
    "@id": id,
    name: term.name,
    ...(term.huName ? { alternateName: term.huName } : {}),
    // schema.org termCode is a single string, so the endings ride as one line
    // rather than being restated as the name.
    termCode: term.suffixes.join(" / "),
    ...(term.summary ? { description: term.summary } : {}),
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Hungarian noun cases",
      url: `${SITE_ORIGIN}/cases`,
    },
  };
}

/**
 * The page's structured data, as a single @graph.
 *
 * WebSite and Organization are defined on "/" only; every other page points at
 * them by @id instead of restating them. That is what stops eighteen case
 * sheets from each claiming to be the site itself.
 */
function graphFor(
  fullTitle: string,
  shortTitle: string,
  description: string,
  path: string,
  { kind = "page", crumbs = [], term, teaches }: PageOptions,
): JsonNode[] {
  const url = `${SITE_ORIGIN}${path}`;
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;
  const termId = `${url}#term`;
  const lesson = kind === "lesson";

  const page: JsonNode = {
    "@type": lesson ? "LearningResource" : "WebPage",
    "@id": pageId,
    url,
    name: fullTitle,
    description,
    inLanguage: lesson ? ["en", "hu"] : "en",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": breadcrumbId },
    ...(lesson ? { learningResourceType: "lesson" } : {}),
    ...(lesson && teaches ? { teaches } : {}),
    ...(term ? { mainEntity: { "@id": termId } } : {}),
  };

  const graph: JsonNode[] = [];

  if (kind === "home") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: APP_NAME,
        alternateName: APP_MEANING,
        description: APP_DESCRIPTION,
        url: SITE_ORIGIN,
        inLanguage: ["en", "hu"],
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: APP_NAME,
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/icon-512.png`,
      },
    );
  }

  graph.push(page);
  if (term) graph.push(definedTerm(termId, term));
  // The home page is "Desk" in the nav and the tab bar; keep the trail saying so.
  const leaf: Crumb = { name: kind === "home" ? "Desk" : shortTitle, path };
  graph.push(breadcrumbList(breadcrumbId, [...crumbs, leaf]));

  return graph;
}

export function pageHead(
  title?: string,
  description?: string,
  rawPath = "/",
  options: PageOptions = {},
) {
  const path = normalizePath(rawPath);
  const full = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`;
  const desc = description ?? APP_DESCRIPTION;
  const url = `${SITE_ORIGIN}${path}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: full },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
      {
        // The router renders this as a single escaped <script type="application/ld+json">
        // inside <head>. One per page: the /cases layout route returns {} when it is not
        // the leaf match, so no second graph competes with the sheet's own.
        "script:ld+json": {
          "@context": "https://schema.org",
          "@graph": graphFor(full, title ?? APP_NAME, desc, path, options),
        },
      },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
