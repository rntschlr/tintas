import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Paper } from "@/components/page";
import { APP_NAME, REPO_URL, SUPPORT_EMAIL } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: ({ match }) =>
    pageHead("Support", `Help with ${APP_NAME}, the Hungarian field notebook.`, match.pathname, {
      crumbs: [{ name: "Desk", path: "/" }],
    }),
});

function SupportPage() {
  const repoHost = REPO_URL.replace("https://", "");
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Help"
        title="Support"
        lead={`${APP_NAME} is a Hungarian field notebook. If something is wrong, write and include the page you were on.`}
      />
      <div className="space-y-4">
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Email</p>
          <a className="mt-2 block font-medium text-fg" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-2 text-sm text-muted">Usual reply within a few days.</p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Source</p>
          <a className="mt-2 block font-medium text-fg" href={REPO_URL}>
            {repoHost}
          </a>
          <p className="mt-2 text-sm text-muted">Open an issue for a bug or a missing ending.</p>
        </Paper>
      </div>
    </div>
  );
}
