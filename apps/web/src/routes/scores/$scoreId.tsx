import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { fetchScore } from "#/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  CirclePlay,
  FileText,
  Info,
  ListMusic,
} from "lucide-react";
import ScoreViewer from "#/components/score-viewer";
import LyricsViewer from "#/components/lyrics-viewer";

export const Route = createFileRoute("/scores/$scoreId")({
  component: ScorePage,
  loader: ({ params }) => fetchScore(params.scoreId),
});

function ScorePage() {
  const score = Route.useLoaderData();
  const { lyrics, lyricsTrans, lyricsDe, lyricsEn, lyricsFr, description } = score;

  return (
    <div className="mx-auto flex h-full max-w-7xl gap-6 px-4 py-3 sm:px-6 lg:px-8">
      <Tabs defaultValue="preview" className="w-full gap-4 py-10">
        <TabsList className="w-full">
          <TabsTrigger value="preview">
            <ListMusic className="size-5" />
            Партитура
          </TabsTrigger>
          <TabsTrigger value="lyrics">
            <FileText className="size-5" />
            Текст
          </TabsTrigger>
          <TabsTrigger value="description">
            <Info className="size-5" />
            Описание
          </TabsTrigger>
          <TabsTrigger value="player">
            <CirclePlay className="size-5" />
            Плеър
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
        <TabsContent value="description">{description}</TabsContent>
        <TabsContent value="player">Hear the music here.</TabsContent>
      </Tabs>
    </div>
  );
}
