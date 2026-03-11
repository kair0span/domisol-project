import { fetchScores } from "#/lib/api";
import type { Score } from "@repo/schemas";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/scores/")({
  loader: () => fetchScores(),
  component: ScoresPage,
});

function ScoresPage() {
  const scores = Route.useLoaderData();
  return (
    <div className="min-h-[cavlc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-300 mb-4">Scores</h1>
          <div className="flex flex-col gap-8 p-4">
            {scores?.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ score }: { score: Score }) {
  const { id, title } = score;
  return (
    <div className="flex flex-col gap-2">
      <Link
        to={`/scores/$scoreId`}
        params={{ scoreId: String(id) }}
        className="inline-flex items-center gap-2 bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
      >
        {title}
      </Link>

    </div>
  );
}
