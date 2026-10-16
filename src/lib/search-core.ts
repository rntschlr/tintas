export type SearchHit = {
  href: string;
  title: string;
  subtitle: string;
};

/** Lowercase, then strip combining marks so "haz" finds "ház" and "o" finds "ő". */
export function foldAccents(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}+/gu, "").normalize("NFC");
}

export function createSearchMatcher(index: readonly SearchHit[], limit = 20) {
  const normalizedIndex = index.map((hit) => {
    const title = hit.title;
    const subtitle = hit.subtitle;
    return {
      hit,
      key: hit.href + title,
      title: title.toLowerCase().normalize("NFC"),
      subtitle: subtitle.toLowerCase().normalize("NFC"),
      foldedTitle: foldAccents(title),
      foldedSubtitle: foldAccents(subtitle),
    };
  });

  return (q: string): SearchHit[] => {
    const n = q.trim().toLowerCase().normalize("NFC");
    if (!n) return [];
    const f = foldAccents(n);
    const scored = normalizedIndex
      .map(({ hit, title, subtitle, foldedTitle, foldedSubtitle, key }) => {
        let score = 0;
        // Exact (accent-faithful) matches score 8/4/2 and always outrank the
        // accent-insensitive fallback, which scores at most 2 + 1 + 0.5.
        if (title === n || title.startsWith(n)) score += 8;
        if (title.includes(n)) score += 4;
        if (subtitle.includes(n)) score += 2;
        if (score === 0) {
          if (foldedTitle.startsWith(f)) score += 2;
          if (foldedTitle.includes(f)) score += 1;
          if (foldedSubtitle.includes(f)) score += 0.5;
        }
        return { hit, key, score };
      })
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    const out: SearchHit[] = [];
    for (const { hit, key } of scored) {
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(hit);
      if (out.length >= limit) break;
    }
    return out;
  };
}

export function searchHits(q: string, index: SearchHit[], limit = 20): SearchHit[] {
  if (!q.trim()) return [];
  return createSearchMatcher(index, limit)(q);
}
