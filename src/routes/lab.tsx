import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { CaseLab, Conjugator, HarmonyLab } from "@/components/labs";
import { PageHeader } from "@/components/page";

export const Route = createFileRoute("/lab")({
  component: LabPage,
  head: ({ match }) =>
    pageHead("Workbenches", "Decline a noun or conjugate a verb as you type.", match.pathname, {
      crumbs: [{ name: "Desk", path: "/" }],
    }),
});

function LabPage() {
  const verb = useRouterState({
    select: (state) => new URLSearchParams(state.location.searchStr).get("verb") ?? undefined,
  });
  return (
    <div>
      <PageHeader
        id="lab"
        kicker="Workbenches"
        title="Try it on a live word"
        lead="Harmony first, then click a noun through all eighteen cases, then conjugate a verb in both columns."
      />
      <div className="flex flex-col gap-8">
        <HarmonyLab />
        <CaseLab />
        <div id="conjugator" className="scroll-mt-28">
          <Conjugator initialVerb={verb} />
        </div>
      </div>
    </div>
  );
}
