import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { fetchScore } from "#/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlay, FileText, Info, ListMusic } from "lucide-react";
import ScoreViewer from "#/components/score-viewer";
import LyricsViewer from "#/components/lyrics-viewer";
import DescriptionViewer from "#/components/description-viewer";
import { useEffect, useState } from "react";

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
    composer,
    lyricist,
    location,
    date,
    category,
    genre,
    color,
    key,
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
    <div className="mx-auto flex h-full max-w-7xl gap-6 px-4 py-3 sm:px-6 lg:px-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full gap-4 py-10"
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
            composer={composer}
            lyricist={lyricist}
            location={location}
            date={date}
            category={category}
            genre={genre}
            color={color}
            key={key}
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
