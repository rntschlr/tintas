import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Languages, Layers, LayoutGrid, Share, Target } from "lucide-react";
import { NAV_GROUPS } from "@/data/nav";
import { namesForDate } from "@/data/namedays";
import { APP_NAME, APP_TAGLINE, REPO_URL } from "@/lib/brand";
import { browserStorage } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchDialog } from "@/components/search-dialog";

const TABS = [
  { id: "desk", href: "/", label: "Desk", icon: BookOpen },
  { id: "cases", href: "/cases", label: "Cases", icon: Layers },
  { id: "verbs", href: "/verbs", label: "Verbs", icon: Languages },
  { id: "practice", href: "/practice", label: "Drill", icon: Target },
] as const;

const INSTALL_KEY = "tinta-install-dismissed";
const LEGACY_INSTALL_KEY = "magdolna-install-dismissed";

function pathActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

function InkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--color-ink)" />
      <path
        fill="var(--color-bg)"
        d="M8.8 23.6V8.4h4.4L16 16.2l2.8-7.8h4.4v15.2h-3.3V14.4L17.1 22h-2.2l-2.8-7.6v9.2z"
      />
      <rect x="9" y="25.2" width="14" height="1.7" rx="0.85" fill="var(--color-primary)" />
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-h-11 items-center gap-3">
      <InkMark className="size-9 shrink-0" />
      <span className="min-w-0">
        <span className="block font-display text-2xl font-semibold tracking-tight text-fg">
          {APP_NAME}
        </span>
        {compact ? null : (
          <span className="mt-0.5 block text-xs tracking-[0.14em] text-muted uppercase">
            {APP_TAGLINE}
          </span>
        )}
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-5" aria-label="Notebook">
      {NAV_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 px-3 text-xs font-medium tracking-[0.16em] text-subtle uppercase">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                    active
                      ? "bg-bg-elevated font-medium text-fg"
                      : "text-muted hover:bg-bg-elevated/70 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function useIosInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios =
      /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const framed = window.self !== window.top;
    const dismissed =
      browserStorage.getItem(INSTALL_KEY) === "1" ||
      browserStorage.getItem(LEGACY_INSTALL_KEY) === "1";
    setShow(ios && !standalone && !framed && !dismissed);
  }, []);

  const dismiss = () => {
    browserStorage.setItem(INSTALL_KEY, "1");
    setShow(false);
  };

  return { show, dismiss };
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nev = namesForDate(new Date());
  const install = useIosInstallHint();
  const tabMatch = TABS.some((tab) => pathActive(pathname, tab.href));

  return (
    <div className="tinta-shell bg-bg text-fg">
      <a href="#main" className="skip-link">
        Skip to notes
      </a>
      <div className="mx-auto flex min-h-dvh max-w-7xl">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border px-4 py-6 md:flex">
          <Brand />
          {nev.names.length > 0 ? (
            <p className="mt-5 text-xs text-subtle">
              Névnap · {nev.label}
              <span className="mt-0.5 block font-serif text-sm text-fg">
                {nev.names.join(", ")}
              </span>
            </p>
          ) : null}
          <ScrollArea className="mt-6 flex-1">
            <NavList />
          </ScrollArea>
          <p className="pt-4 text-xs leading-relaxed text-subtle">
            {APP_NAME} — {APP_TAGLINE.toLowerCase()}. Accents are not optional.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:px-8">
            <div className="md:hidden">
              <Brand compact />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <SearchDialog />
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link to="/practice">Drill</Link>
              </Button>
            </div>
          </header>
          {install.show ? (
            <div className="flex items-start gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
              <Share className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">Add {APP_NAME} to your Home Screen</p>
                <p className="mt-0.5 text-sm text-muted">
                  In Safari, tap Share, then Add to Home Screen. It opens like its own app.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={install.dismiss}>
                Dismiss
              </Button>
            </div>
          ) : null}
          <main id="main" className="flex-1 px-4 py-8 pb-24 md:px-10 md:py-10 md:pb-10">
            {children}
            <footer className="mt-16 border-t border-border pt-6 text-xs text-subtle">
              <p>
                {APP_NAME} · tinta, ink · {APP_TAGLINE}. No account. Progress stays on this device.
              </p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link to="/about" className="hover:text-fg">
                  About
                </Link>
                <Link to="/privacy" className="hover:text-fg">
                  Privacy
                </Link>
                <Link to="/support" className="hover:text-fg">
                  Support
                </Link>
                <a href={REPO_URL} rel="noreferrer" className="hover:text-fg">
                  Source
                </a>
              </p>
            </footer>
          </main>
        </div>
      </div>

      <nav
        className="tinta-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-sm md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = pathActive(pathname, tab.href);
            return (
              <Link
                key={tab.id}
                to={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                  active ? "font-medium text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {tab.label}
              </Link>
            );
          })}
          <button
            type="button"
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              open || !tabMatch ? "font-medium text-primary" : "text-muted",
            )}
            onClick={() => setOpen(true)}
          >
            <LayoutGrid className="size-5" />
            More
          </button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Brand />
          </SheetHeader>
          <ScrollArea className="mt-4 max-h-96">
            <NavList onNavigate={() => setOpen(false)} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
