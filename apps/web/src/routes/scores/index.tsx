import { fetchScores } from "#/lib/api";
import type { ScoreResponse } from "@repo/schemas";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Plus } from "lucide-react";

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Scores
            </h1>
          </div>
          <Button asChild>
            <Link to="/scores/score-add"><Plus /></Link>
          </Button>
        </div>
        <div>
          
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

function ScoreCard({ score }: { score: ScoreResponse }) {
  const {
    id,
    title,
    composer,
    lyricist,
    category,
    key,
    color,
    location,
    description,
    genre,
    date,
  } = score;

  const scoreDate = date ? new Date(date) : null;

  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    lime: "bg-lime-500",
    teal: "bg-teal-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    fuchsia: "bg-fuchsia-500",
  };

  const colorClass = color
    ? colorMap[color.toLowerCase()] || "bg-gray-500"
    : "bg-gray-500";

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 border-border/40 hover:border-primary/30 overflow-hidden">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold leading-tight text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3">
              {title}
            </CardTitle>
            {(composer || lyricist) && (
              <div className="space-y-1.5">
                {composer && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted-foreground shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <span className="text-sm text-foreground/90 font-medium">
                      {composer}
                    </span>
                  </div>
                )}
                {lyricist && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted-foreground shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="text-sm text-foreground/80">
                      {lyricist}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          {category && (
            <Badge
              variant="secondary"
              className="capitalize shrink-0 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 transition-colors font-semibold px-3 py-1"
            >
              {category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="flex flex-wrap gap-2">
          {genre && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              <span className="text-xs font-semibold text-foreground/80 capitalize">
                {genre}
              </span>
            </div>
          )}
          {key && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <svg
                className="w-3.5 h-3.5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span className="text-xs font-bold text-primary">{key}</span>
            </div>
          )}

          {color && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              <span
                className={`h-3 w-3 rounded-full ${colorClass} ring-2 ring-background shadow-md`}
                title={color}
              />
              <span className="text-xs font-medium text-foreground/70 capitalize">
                {color}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {description && (
        <CardContent className="pt-0 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
            {description}
          </p>
        </CardContent>
      )}

      <CardFooter className="border-t border-border/40 bg-linear-to-br from-muted/30 to-muted/10 flex items-center justify-between pt-4">
        <div className="inline-flex items-center gap-4 text-xs text-muted-foreground">
          {location && (
            <div className="inline-flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium">{location}</span>
            </div>
          )}
          {scoreDate && (
            <time className="inline-flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {scoreDate.toLocaleDateString("bg-BG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
        </div>
        <Button
          asChild
          size="sm"
          className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Link to="/scores/$scoreId" params={{ scoreId: id }}>
            Виж повече
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
