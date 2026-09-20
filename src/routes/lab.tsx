import { createFileRoute } from "@tanstack/react-router";
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
        <Conjugator />
      </div>
    </div>
  );
}
