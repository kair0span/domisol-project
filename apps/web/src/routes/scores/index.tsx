import { useState } from "react";
import { fetchScores } from "#/lib/api";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  Filter,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { ScoreAddModal } from "#/components/score-add";

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
  color: z
    .union([
      z.literal("all"),
      z.literal("red"),
      z.literal("orange"),
      z.literal("yellow"),
      z.literal("green"),
      z.literal("blue"),
      z.literal("darkblue"),
      z.literal("purple"),
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
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  const defaultSearch: ScoreSearch = {
    q: "",
    category: "all",
    color: "all",
    sort: "title_asc",
    page: 1,
  };

  const scores = Route.useLoaderData();
  const { q, category, color, sort, page } = Route.useSearch();

  const ITEMS_PER_PAGE = 9;

  const filteredScores = scores
    .filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesColor = color === "all" || p.color === color;
      const matchesSearch =
        q === "" || p.title.toLowerCase().includes(q.toLowerCase());

      return matchesCategory && matchesColor && matchesSearch;
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
      <ScoreAddModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => router.invalidate()}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Music Scores
          </h1>
          <Button
            type="button"
            onClick={() => setAddOpen(true)}
            aria-label="Add score"
          >
            <Plus />
          </Button>
        </div>
        {/* Filter and Search Section */}
        <div className="mb-8 space-y-4">
          {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {/* Category Filter - Left on desktop, full width on mobile */}
            <div className="w-full sm:w-auto sm:flex-shrink-0">
              <Select
                value={category}
                onValueChange={(value) =>
                  updateSearch({ category: value as ScoreSearch["category"] })
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="По категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички категории</SelectItem>
                  <SelectItem value="братски">Братски</SelectItem>
                  <SelectItem value="от Учителя">От Учителя</SelectItem>
                  <SelectItem value="след 1944">След 1944</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input - Center on desktop, full width on mobile */}
            <div className="relative flex-1 w-full">
              <Input
                className="w-full pr-10"
                placeholder="Търсене по заглавие ..."
                value={q}
                onChange={(e) => updateSearch({ q: e.target.value })}
              />
              {q && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSearch({ q: "" })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Filter Menu - Right on desktop, full width on mobile */}
            <div className="w-full sm:w-auto sm:flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Филтри</span>
                    {(color !== "all" || sort !== "title_asc") && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {(color !== "all" ? 1 : 0) + (sort !== "title_asc" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-80" align="end">
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <DropdownMenuLabel className="px-0">Цвят</DropdownMenuLabel>
                      <Select
                        value={color}
                        onValueChange={(value) =>
                          updateSearch({ color: value as ScoreSearch["color"] })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Избери цвят" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Всички цветове</SelectItem>
                          <SelectItem value="red">Червен</SelectItem>
                          <SelectItem value="orange">Оранжев</SelectItem>
                          <SelectItem value="yellow">Жълт</SelectItem>
                          <SelectItem value="green">Зелен</SelectItem>
                          <SelectItem value="blue">Син</SelectItem>
                          <SelectItem value="darkblue">Тъмносин</SelectItem>
                          <SelectItem value="purple">Виолетов</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="space-y-2">
                      <DropdownMenuLabel className="px-0">Сортиране</DropdownMenuLabel>
                      <Select
                        value={sort}
                        onValueChange={(value) =>
                          updateSearch({ sort: value as ScoreSearch["sort"] })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Избери сортиране" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title_asc">
                            <div className="flex items-center gap-2">
                              <ArrowDownNarrowWide className="w-4 h-4" />
                              <span>Заглавие (А-Я)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="title_desc">
                            <div className="flex items-center gap-2">
                              <ArrowUpWideNarrow className="w-4 h-4" />
                              <span>Заглавие (Я-А)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="date_asc">
                            <div className="flex items-center gap-2">
                              <ArrowDownNarrowWide className="w-4 h-4" />
                              <span>Дата (възходящо)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="date_desc">
                            <div className="flex items-center gap-2">
                              <ArrowUpWideNarrow className="w-4 h-4" />
                              <span>Дата (низходящо)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(category !== "all" || color !== "all" || sort !== "title_asc" || q) && (
                      <>
                        <DropdownMenuSeparator />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="w-full"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Изчисти всички филтри
                        </Button>
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters Display - Shows on mobile for better UX */}
          {(category !== "all" || color !== "all" || sort !== "title_asc" || q) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Активни филтри:</span>
              {category !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSearch({ category: "all" })}
                  className="h-7 text-xs"
                >
                  {category}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {color !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSearch({ color: "all" })}
                  className="h-7 text-xs"
                >
                  Цвят: {color === "red" ? "Червен" : color === "orange" ? "Оранжев" : color === "yellow" ? "Жълт" : color === "green" ? "Зелен" : color === "blue" ? "Син" : color === "darkblue" ? "Тъмносин" : "Виолетов"}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {sort !== "title_asc" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSearch({ sort: "title_asc" })}
                  className="h-7 text-xs"
                >
                  {sort === "title_desc" ? "Заглавие (Я-А)" : sort === "date_asc" ? "Дата (възходящо)" : "Дата (низходящо)"}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {q && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSearch({ q: "" })}
                  className="h-7 text-xs"
                >
                  Търсене: "{q}"
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          )}
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
