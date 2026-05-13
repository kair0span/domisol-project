import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import type React from "react";

type LyricsViewerProps = {
  title: string;
  titleTrans: string;
  lyrics: string;
  lyricsTrans?: string;
  lyricsDe?: string;
  lyricsEn?: string;
  lyricsFr?: string;
};

type LeftLanguage = "original" | "transliteration";
type RightLanguage = "de" | "en" | "fr";

// Helper function to split text into stanzas
function formatStanzas(text: string): React.ReactElement[] {
  if (!text) return [];

  // Split by double line breaks to identify stanzas
  const stanzas = text.split(/\n\s*\n/).filter(stanza => stanza.trim());

  return stanzas.map((stanza, index) => (
    <div key={index} className="mb-8 last:mb-0">
      {stanza.split('\n').map((line, lineIndex) => (
        <div key={lineIndex} className="leading-relaxed">
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  ));
}

export default function LyricsViewer({
  title,
  titleTrans,
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

  const leftStanzas = useMemo(() => formatStanzas(leftText), [leftText]);
  const rightStanzas = useMemo(() => formatStanzas(rightText), [rightText]);

  return (
    <section className="space-y-6 pt-4">
      {/* Title Section */}
      <div className="text-center space-y-2 pb-4 border-b border-border/50">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground font-light italic">
          {titleTrans}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <CardContent className="pt-6">
            <div className="min-h-[360px] rounded-xl border border-border/60 bg-muted/20 p-6 sm:p-8">
              <div className="text-base sm:text-lg leading-relaxed text-foreground font-serif">
                {leftStanzas.length > 0 ? leftStanzas : (
                  <p className="text-muted-foreground italic">{leftText}</p>
                )}
              </div>
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
          <CardContent className="pt-6">
            <div className="min-h-[360px] rounded-xl border border-border/60 bg-muted/20 p-6 sm:p-8">
              <div className="text-base sm:text-lg leading-relaxed text-foreground font-serif">
                {rightStanzas.length > 0 ? rightStanzas : (
                  <p className="text-muted-foreground italic">{rightText}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
