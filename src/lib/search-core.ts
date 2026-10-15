export type SearchHit = {
  href: string;
  title: string;
  subtitle: string;
};

export function createSearchMatcher(index: readonly SearchHit[], limit = 20) {
  const normalizedIndex = index.map((hit) => {
    const title = hit.title;
    const subtitle = hit.subtitle;
    return {
      hit,
      key: hit.href + title,
      title: title.toLowerCase(),
      subtitle: subtitle.toLowerCase(),
    };
  });

  return (q: string): SearchHit[] => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    const scored = normalizedIndex
      .map(({ hit, title, subtitle, key }) => {
        let score = 0;
        if (title === n || title.startsWith(n)) score += 8;
        if (title.includes(n)) score += 4;
        if (subtitle.includes(n)) score += 2;
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
