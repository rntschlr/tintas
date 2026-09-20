import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Paper } from "@/components/page";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: ({ match }) =>
    pageHead(
      "Privacy",
      `${APP_NAME} does not need an account and does not sell data.`,
      match.pathname,
      { crumbs: [{ name: "Desk", path: "/" }] },
    ),
});

function PrivacyPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Legal"
        title="Privacy"
        lead={`${APP_NAME} is a grammar notebook. It does not need an account, and it does not sell data.`}
      />
      <Paper className="space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Progress (opened sheets, bookmarks, drill scores) is stored on this device only. It is not
          sent to a {APP_NAME} server, and it is not used for advertising.
        </p>
        <p>
          The hosted site may be served through Cloudflare or another operator you connect. Those
          operators may collect standard request logs (IP address, browser, pages opened) to keep
          the site running.
        </p>
        <p>
          If you install {APP_NAME} from the App Store, the wrapper uses the same on-device
          notebook. No extra tracking SDKs are included. Fonts are self-hosted; the public notebook
          does not call Google Fonts.
        </p>
        <p>
          Questions:{" "}
          <a className="text-primary" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="text-xs text-subtle">Last updated 17 September 2026.</p>
      </Paper>
    </div>
  );
}
