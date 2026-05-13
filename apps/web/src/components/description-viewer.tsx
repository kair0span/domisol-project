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
import { Music, User, MapPin, Calendar, Tag, Palette, Music2 } from "lucide-react";

type DescriptionViewerProps = {
    title: string;
    composer: string;
    lyricist: string;
    location: string;
    date: string;
    category: string;
    genre: string;
    color: string;
    key: string;
    description: string;
    descriptionDe?: string;
    descriptionEn?: string;
    descriptionFr?: string;
};

type TranslationLanguage = "de" | "en" | "fr";

export default function DescriptionViewer({
    title,
    composer,
    lyricist,
    location,
    date,
    category,
    genre,
    color,
    key,
    description,
    descriptionDe = "",
    descriptionEn = "",
    descriptionFr = "",
}: DescriptionViewerProps) {
    const [translationLanguage, setTranslationLanguage] =
        useState<TranslationLanguage>("de");

    const translatedDescription = useMemo(() => {
        if (translationLanguage === "en") {
            return descriptionEn || "No English translation available.";
        }
        if (translationLanguage === "fr") {
            return descriptionFr || "No French translation available.";
        }
        return descriptionDe || "No German translation available.";
    }, [translationLanguage, descriptionDe, descriptionEn, descriptionFr]);

    const metadata = [
        { icon: Music, label: "Composer", value: composer },
        { icon: User, label: "Lyricist", value: lyricist },
        { icon: Music2, label: "Key", value: key },
        { icon: Tag, label: "Genre", value: genre },
        { icon: Tag, label: "Category", value: category },
        { icon: Palette, label: "Color", value: color },
        { icon: MapPin, label: "Location", value: location },
        { icon: Calendar, label: "Date", value: date },
    ];

    return (
        <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Description & Information
                </h2>
                <Badge variant="outline">multilingual</Badge>
            </div>

            {/* Title Section */}
            <Card className="bg-card/70 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h3>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Left Column - Bulgarian Original */}
                <Card className="bg-card/70 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/70">
                        <CardTitle className="flex items-center gap-2">
                            <span>Original (Bulgarian)</span>
                            <Badge variant="secondary" className="text-xs">
                                BG
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Core Information Grid */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Core Information
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {metadata.map(({ icon: Icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                                    >
                                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {label}
                                            </p>
                                            <p className="break-words text-sm font-medium text-foreground">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Description
                            </h3>
                            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                                    {description || "No description available."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column - Translations */}
                <Card className="bg-card/70 backdrop-blur-sm">
                    <CardHeader className="flex flex-col gap-3 border-b border-border/70">
                        <CardTitle>Translations</CardTitle>
                        <Select
                            value={translationLanguage}
                            onValueChange={(value) =>
                                setTranslationLanguage(value as TranslationLanguage)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Choose translation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="de">
                                    <div className="flex items-center gap-2">
                                        <span>German</span>
                                        <Badge variant="outline" className="text-xs">
                                            DE
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="en">
                                    <div className="flex items-center gap-2">
                                        <span>English</span>
                                        <Badge variant="outline" className="text-xs">
                                            EN
                                        </Badge>
                                    </div>
                                </SelectItem>
                                <SelectItem value="fr">
                                    <div className="flex items-center gap-2">
                                        <span>French</span>
                                        <Badge variant="outline" className="text-xs">
                                            FR
                                        </Badge>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Translated Core Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Core Information
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {metadata.map(({ icon: Icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                                    >
                                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {label}
                                            </p>
                                            <p className="break-words text-sm font-medium text-foreground">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Translated Description */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Description
                            </h3>
                            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                                    {translatedDescription}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
