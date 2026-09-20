import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageHeader } from "@/components/page";
import { QuizPanel } from "@/components/quiz-panel";

export const Route = createFileRoute("/practice")({
  component: PracticePage,
  head: ({ match }) =>
    pageHead("Drill", "Twenty questions. Best score stays on this device.", match.pathname, {
      crumbs: [{ name: "Desk", path: "/" }],
    }),
});

function PracticePage() {
  return (
    <div>
      <PageHeader
        id="practice"
        kicker="Drill"
        title="Twenty questions"
        lead="Alphabet traps, triads, definite objects, fél négy. Best score stays on this device."
      />
      <QuizPanel />
    </div>
  );
}
