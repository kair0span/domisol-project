import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Badge } from "#/components/ui/badge";

type LyricsViewerProps = {
  lyrics: string;
  lyricsTrans?: string;
  lyricsDe?: string;
  lyricsEn?: string;
  lyricsFr?: string;
};

type LeftLanguage = "original" | "transliteration";
type RightLanguage = "de" | "en" | "fr";

export default function LyricsViewer({
  lyrics,
  lyricsTrans = "",
  lyricsDe = "",
  lyricsEn = "",
  lyricsFr = "",
}: LyricsViewerProps) {
  const [leftLanguage, setLeftLanguage] = useState<LeftLanguage>("original");
  const [rightLanguage, setRightLanguage] = useState<RightLanguage>("de");

  const leftText = useMemo(() => {
    if (leftLanguage === "transliteration") {
      return lyricsTrans || "No transliterated lyrics available.";
    }
    return lyrics || "No original lyrics available.";
  }, [leftLanguage, lyrics, lyricsTrans]);

  const rightText = useMemo(() => {
    if (rightLanguage === "en") {
      return lyricsEn || "No English translation available.";
    }
    if (rightLanguage === "fr") {
      return lyricsFr || "No French translation available.";
    }
    return lyricsDe || "No German translation available.";
  }, [rightLanguage, lyricsDe, lyricsEn, lyricsFr]);

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Lyrics Viewer</h2>
        <Badge variant="outline">multilingual</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-col gap-3 border-b border-border/70">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Original / Transliteration</CardTitle>
            </div>
            <Select
              value={leftLanguage}
              onValueChange={(value) => setLeftLanguage(value as LeftLanguage)}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Choose text" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original text</SelectItem>
                <SelectItem value="transliteration">
                  Transliterated text
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="min-h-[360px] rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {leftText}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-col gap-3 border-b border-border/70">
            <CardTitle>Translations</CardTitle>
            <Select
              value={rightLanguage}
              onValueChange={(value) =>
                setRightLanguage(value as RightLanguage)
              }
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Choose translation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="min-h-[360px] rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {rightText}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
