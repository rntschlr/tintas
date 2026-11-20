import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_DESCRIPTION, APP_NAME, THEME_COLOR } from "@/lib/brand";
import appCss from "../styles.css?url";

// Structured data is per-page in src/lib/seo.ts, not the root layout.
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: `${APP_NAME} — Hungarian field notes` },
      { name: "description", content: APP_DESCRIPTION },
      { name: "theme-color", content: THEME_COLOR },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <TooltipProvider delayDuration={200}>
          <AppShell>
            <Outlet />
          </AppShell>
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}
