import { fetchScore } from "#/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scores/$scoreId")({
  component: ScorePage,
  loader: ({ params }) => fetchScore(params.scoreId),
});

function ScorePage() {
  const score = Route.useLoaderData();
  const { title } = score;

  return (
    <div className="flex flex-col text-center mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
    </div>
  );
}
