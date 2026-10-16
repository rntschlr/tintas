import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchHit } from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchMatcher = (query: string) => SearchHit[];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState<SearchMatcher | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const router = useRouter();
  const hits = search?.(q) ?? [];

  useEffect(() => {
    if (!open || search || searchError) return;
    let cancelled = false;
    setLoading(true);
    import("@/lib/search")
      .then(({ buildSearchIndex, createSearchMatcher }) => {
        if (!cancelled) setSearch(() => createSearchMatcher(buildSearchIndex()));
      })
      .catch((error: unknown) => {
        console.error("Unable to load the search index", error);
        if (!cancelled) setSearchError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, search, searchError]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    // Keep the fragment (and any ?query) in the pushed URL so the destination
    // knows its target, then wait for that section to actually render before
    // scrolling — one animation frame is not enough on a fresh route.
    router.history.push(href || "/");
    const hash = href.split("#")[1];
    if (hash) scrollToWhenReady(decodeURIComponent(hash));
  };

  return (
    <>
      <Button
        variant="secondary"
        className="h-11 w-auto justify-start gap-2 px-3 text-muted md:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search notes</span>
        <span className="sm:hidden">Search</span>
        <kbd className="ml-auto hidden rounded-sm border border-border px-1.5 text-xs text-subtle md:inline">
          ⌘K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>Search the desk</DialogTitle>
          </DialogHeader>
          <div className="px-5">
            <Input
              autoFocus
              placeholder="ház, accusative, szeretlek, s/sz…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter" && hits[active]) {
                  e.preventDefault();
                  go(hits[active].href);
                }
              }}
            />
          </div>
          <ul className="max-h-80 overflow-auto px-2 pb-3">
            {loading ? (
              <li role="status" className="px-3 py-6 text-sm text-muted">Loading search…</li>
            ) : null}
            {searchError ? (
              <li className="px-3 py-6 text-sm text-muted">
                Search could not load.{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline"
                  onClick={() => {
                    // Browsers cache a failed dynamic import for the document's
                    // lifetime, so re-running import() would reject instantly.
                    // Reload to issue a fresh request for the search chunk.
                    window.location.reload();
                  }}
                >
                  Try again
                </button>
              </li>
            ) : null}
            {search && q && hits.length === 0 ? (
              <li className="px-3 py-6 text-sm text-muted">Nothing matches. Try a suffix or an English gloss.</li>
            ) : null}
            {hits.map((h, i) => (
              <li key={h.href + h.title}>
                <button
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                    i === active ? "bg-bg-elevated" : "hover:bg-bg-elevated",
                  )}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(h.href)}
                >
                  <p className="font-serif text-base text-fg">{h.title}</p>
                  <p className="line-clamp-1 text-xs text-muted">{h.subtitle}</p>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}

function scrollToWhenReady(id: string, timeoutMs = 3000) {
  const started = performance.now();
  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (performance.now() - started < timeoutMs) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
