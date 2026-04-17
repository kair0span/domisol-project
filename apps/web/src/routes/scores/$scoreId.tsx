import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { fetchScore } from "#/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlay, FileText, Info, ListMusic } from "lucide-react";

export const Route = createFileRoute("/scores/$scoreId")({
  component: ScorePage,
  loader: ({ params }) => fetchScore(params.scoreId),
});

function ScorePage() {
  const score = Route.useLoaderData();
  const { lyrics, description, fileUrl } = score;

  return (
    <div className="mx-auto flex h-full max-w-7xl p-3 gap-6 px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="partitur">
        <TabsList>
          <TabsTrigger value="partitur">
            <ListMusic />
            Partitur
          </TabsTrigger>
          <TabsTrigger value="lyrics">
            <FileText />
            Lyrics
          </TabsTrigger>
          <TabsTrigger value="player">
            <CirclePlay />
            Player
          </TabsTrigger>
          <TabsTrigger value="info">
            <Info />
            Info
          </TabsTrigger>
        </TabsList>
        <TabsContent value="partitur">
          <p>{fileUrl}</p>
        </TabsContent>
        <TabsContent value="lyrics">
          <p className="text-xl">{lyrics}</p>
        </TabsContent>
        <TabsContent value="player">Hear the music here.</TabsContent>
        <TabsContent value="info">{description}</TabsContent>
      </Tabs>
    </div>
  );
}
