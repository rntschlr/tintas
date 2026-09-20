import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Paper } from "@/components/page";
import { APP_MEANING, APP_NAME, REPO_URL } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: ({ match }) =>
    pageHead(
      "About",
      `What ${APP_NAME} is, where the grammar comes from, and how it is built.`,
      match.pathname,
      { crumbs: [{ name: "Desk", path: "/" }] },
    ),
});

function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Colophon"
        title="About"
        lead={`${APP_NAME} — ${APP_MEANING} — is a Hungarian grammar notebook for English speakers.`}
      />
      <div className="space-y-4">
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">What this is</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A notebook, not a course. Eighteen noun cases, two conjugations, vowel harmony, and the
            phrases you actually need on the street — each on its own sheet, each short enough to
            read standing up. It is written for the moment you have met a form in the wild and want
            to know what it is doing.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Where it comes from</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            These are field notes: the rules as a learner meets them, with the exceptions that
            actually trip people up kept in and the ones that never come up left out. That makes it
            useful and it makes it incomplete. For the full picture a reference grammar is still the
            right book. If a sheet is wrong, say so — corrections are the point.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">How it is built</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A static site with server rendering, no account, and no tracking. Fonts are self-hosted.
            What you have opened, bookmarked and drilled stays in this browser and is never sent
            anywhere — see{" "}
            <Link to="/privacy" className="text-primary">
              privacy
            </Link>{" "}
            for the detail.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Licence</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Released under CC BY-NC 4.0: copy it, adapt it, teach from it, as long as you credit{" "}
            {APP_NAME} and do not sell it. The full text is in{" "}
            <a className="text-primary" href={`${REPO_URL}/blob/main/LICENSE`}>
              LICENSE
            </a>{" "}
            in the repository.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Contact</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A missing ending, a wrong example, or a sheet that did not land:{" "}
            <Link to="/support" className="text-primary">
              support
            </Link>{" "}
            has the address and the issue tracker.
          </p>
        </Paper>
      </div>
    </div>
  );
}
