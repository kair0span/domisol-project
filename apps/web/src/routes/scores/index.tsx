import { fetchScores } from "#/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Plus } from "lucide-react";
import ScoreCard from "#/components/score-card";
import { Input } from "#/components/ui/input";
import z from "zod";


const scoresSchema = z.object({
  q: z.string().default(""),
})


export const Route = createFileRoute("/scores/")({
  loader: () => fetchScores(),
  component: ScoresPage,
});

function ScoresPage() {
  const scores = Route.useLoaderData();
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Music Scores
          </h1>
          <Button asChild>
            <Link to="/scores/score-add">
              <Plus />
            </Link>
          </Button>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <Input className="w-full max-w-5xl" placeholder="Search scores..." />
          <Button variant="outline">Filter</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {scores?.map((score) => (
            <ScoreCard key={score.id} score={score} />
          ))}
        </div>
      </div>
    </div>
  );
}
