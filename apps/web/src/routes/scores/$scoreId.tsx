import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { fetchScore } from "#/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CirclePlay, FileText, Info, ListMusic } from "lucide-react";
import ScoreViewer from "#/components/score-viewer";
import LyricsViewer from "#/components/lyrics-viewer";
import DescriptionViewer from "#/components/description-viewer";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/scores/$scoreId")({
  component: ScorePage,
  loader: ({ params }) => fetchScore(params.scoreId),
});

function ScorePage() {
  const score = Route.useLoaderData();
  const {
    lyrics,
    lyricsTrans,
    lyricsDe,
    lyricsEn,
    lyricsFr,
    description,
    descriptionDe,
    descriptionEn,
    descriptionFr,
    title,

  } = score;

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("scoreTabPreference") || "preview";
    }
    return "preview";
  });

  useEffect(() => {
    localStorage.setItem("scoreTabPreference", activeTab);
  }, [activeTab]);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 px-4 py-3 sm:px-6 lg:px-8">
      <div className="pt-2">
        <Button variant="outline" asChild>
          <Link to="/scores" className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Назад към всички
          </Link>
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full gap-4 py-2"
      >
        <TabsList className="grid w-full grid-cols-4 gap-1">
          <TabsTrigger value="preview">
            <ListMusic className="size-5" />
            <span className="hidden sm:inline">Партитура</span>
          </TabsTrigger>
          <TabsTrigger value="lyrics">
            <FileText className="size-5" />
            <span className="hidden sm:inline">Текст</span>
          </TabsTrigger>
          <TabsTrigger value="description">
            <Info className="size-5" />
            <span className="hidden sm:inline">Описание</span>
          </TabsTrigger>
          <TabsTrigger value="player">
            <CirclePlay className="size-5" />
            <span className="hidden sm:inline">Плеър</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <ScoreViewer score={score} />
        </TabsContent>
        <TabsContent value="lyrics">
          <LyricsViewer
            title={title}
            titleTrans={score.titleTrans}
            lyrics={lyrics}
            lyricsTrans={lyricsTrans}
            lyricsDe={lyricsDe}
            lyricsEn={lyricsEn}
            lyricsFr={lyricsFr}
          />
        </TabsContent>
        <TabsContent value="description">
          <DescriptionViewer
            title={title}
            titleTrans={score.titleTrans}
            description={description}
            descriptionDe={descriptionDe}
            descriptionEn={descriptionEn}
            descriptionFr={descriptionFr}
          />
        </TabsContent>
        <TabsContent value="player">Hear the music here.</TabsContent>
      </Tabs>
    </div>
  );
}
