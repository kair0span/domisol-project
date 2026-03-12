import { fetchScores } from "#/lib/api";
import type { Score } from "@repo/schemas";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/scores/")({
  loader: () => fetchScores(),
  component: ScoresPage,
});

function ScoresPage() {
  const scores = Route.useLoaderData();
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Music Scores
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse and explore your collection
          </p>
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

function ScoreCard({ score }: { score: Score }) {
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
    createdAt,
  } = score;

  const createdDate = createdAt ? new Date(createdAt) : null;

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50 hover:border-border">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {title}
            </CardTitle>
            {(composer || lyricist) && (
              <div className="mt-2 space-y-1">
                {composer && (
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground/70">Музика:</span>{" "}
                    <span className="text-foreground/80">{composer}</span>
                  </CardDescription>
                )}
                {lyricist && (
                  <CardDescription className="text-sm text-muted-foreground">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground/70">Текст:</span>{" "}
                    <span className="text-foreground/70">{lyricist}</span>
                  </CardDescription>
                )}
              </div>
            )}
          </div>
          {category && (
            <Badge
              variant="secondary"
              className="capitalize shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors"
            >
              {category}
            </Badge>
          )}
        </div>

        {(key || color) && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/30">
            {key && (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Key
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {key}
                </span>
              </div>
            )}
            {color && (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Color
                </span>

                <span
                  className="h-3 w-3 rounded-full border-2 border-background shadow-sm ring-1 ring-border/20"
                  style={{ backgroundColor: color }}
                />

              </div>
            )}
          </div>
        )}
      </CardHeader>

      {description && (
        <CardContent className="pt-0">
          <div className="relative bg-muted/30 rounded-lg p-4 border border-border/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description.length > 120 ? (
                <>
                  {description.slice(0, 120).trim()}
                  {description.length > 120 && !description.slice(0, 120).endsWith('.') && '...'}
                </>
              ) : (
                description
              )}
            </p>
            {description.length > 120 && (
              <div className="absolute bottom-0 right-0 h-6 w-12 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="border-t border-border/30 bg-muted/20 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {location && (
            <div className="inline-flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-chart-3 shadow-sm" />
              <span className="font-medium text-foreground/80">{location}</span>
            </div>
          )}
          {createdDate && (
            <time className="text-xs text-muted-foreground font-medium">
              {createdDate.toLocaleDateString('bg-BG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group-hover:shadow-sm"
        >
          <Link to="/scores/$scoreId" params={{ scoreId: id }}>
            View details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
