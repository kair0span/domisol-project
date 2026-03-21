import { fetchScores } from "#/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import ScoreCard from "#/components/score-card";
import { Input } from "#/components/ui/input";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

const scoreSearchSchema = z.object({
  q: z.string().default(""),
  category: z
    .union([
      z.literal("all"),
      z.literal("братски"),
      z.literal("от Учителя"),
      z.literal("след 1944"),
    ])
    .default("all"),
  sort: z
    .enum(["title_asc", "title_desc", "date_asc", "date_desc", "all"])
    .default("title_asc"),
  page: z.number().default(1),
});

type ScoreSearch = z.infer<typeof scoreSearchSchema>;

export const Route = createFileRoute("/scores/")({
  component: ScoresPage,
  loader: () => fetchScores(),
  validateSearch: scoreSearchSchema,
});

function ScoresPage() {
  const navigate = Route.useNavigate();

  const defaultSearch: ScoreSearch = {
    q: "",
    category: "all",
    sort: "title_asc",
    page: 1,
  };

  const scores = Route.useLoaderData();
  const { q, category, sort, page } = Route.useSearch();

  const ITEMS_PER_PAGE = 9;

  const filteredScores = scores
    .filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesSearch =
        q === "" || p.title.toLowerCase().includes(q.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sort === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      if (sort === "date_asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sort === "date_desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);
  const paginatedScores = filteredScores.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const updateSearch = (updates: Partial<ScoreSearch>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });
  };

  const clearFilters = () => {
    navigate({ search: defaultSearch });
  };

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
        <div className="mb-8 flex items-center gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Input
              className="w-full"
              placeholder="Search scores by title..."
              value={q}
              onChange={(e) => updateSearch({ q: e.target.value })}
            />
            {(q || category !== "all" || sort !== "title_asc") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filter Controls */}

          <div className="flex items-center gap-2">
            <Select
              value={category}
              onValueChange={(value) =>
                updateSearch({ category: value as ScoreSearch["category"] })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                <SelectItem value="братски">Братски</SelectItem>
                <SelectItem value="от Учителя">От Учителя</SelectItem>
                <SelectItem value="след 1944">След 1944</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={sort}
              onValueChange={(value) =>
                updateSearch({ sort: value as ScoreSearch["sort"] })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title_asc">Заглавие (А-Я)</SelectItem>
                <SelectItem value="title_desc">Заглавие (Я-А)</SelectItem>
                <SelectItem value="date_asc">Дата (стари)</SelectItem>
                <SelectItem value="date_desc">Дата (нови)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {paginatedScores.map((score) => (
            <ScoreCard key={score.id} score={score} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav
              role="navigation"
              aria-label="pagination"
              className="mx-auto flex w-full justify-center"
            >
              <ul className="flex items-center gap-1">
                <li>
                  <Link
                    to="/scores"
                    search={(prev) => ({
                      ...prev,
                      page: Math.max(1, page - 1),
                    })}
                  >
                    <Button
                      variant="ghost"
                      size="default"
                      disabled={page <= 1}
                      className="pl-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:block ml-2">Previous</span>
                    </Button>
                  </Link>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <li key={pageNum}>
                      <Link
                        to="/scores"
                        search={(prev) => ({ ...prev, page: pageNum })}
                      >
                        <Button
                          variant={pageNum === page ? "outline" : "ghost"}
                          size="icon"
                          className="w-9 h-9"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    </li>
                  ),
                )}

                <li>
                  <Link
                    to="/scores"
                    search={(prev) => ({
                      ...prev,
                      page: Math.min(totalPages, page + 1),
                    })}
                  >
                    <Button
                      variant="ghost"
                      size="default"
                      disabled={page >= totalPages}
                      className="pr-2"
                    >
                      <span className="hidden sm:block mr-2">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
