import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";

type DescriptionViewerProps = {
    title: string;
    titleTrans: string;
    description: string;
    descriptionDe?: string;
    descriptionEn?: string;
    descriptionFr?: string;
};

type TranslationLanguage = "de" | "en" | "fr";

export default function DescriptionViewer({
    title,
    titleTrans,
    description,
    descriptionDe = "",
    descriptionEn = "",
    descriptionFr = "",
}: DescriptionViewerProps) {
    const [translationLanguage, setTranslationLanguage] =
        useState<TranslationLanguage>("de");

    const translationText = useMemo(() => {
        if (translationLanguage === "en") {
            return descriptionEn || "No English translation available.";
        }
        if (translationLanguage === "fr") {
            return descriptionFr || "No French translation available.";
        }
        return descriptionDe || "No German translation available.";
    }, [translationLanguage, descriptionDe, descriptionEn, descriptionFr]);

    // Format text into paragraphs with improved typography
    const formatParagraphs = (text: string) => {
        if (!text) return [];
        return text
            .split(/\n\s*\n/)
            .filter((para) => para.trim())
            .map((para, index) => (
                <p key={index} className="mb-6 last:mb-0 leading-[1.8] text-justify">
                    {para.trim()}
                </p>
            ));
    };

    const bulgarianParagraphs = useMemo(
        () => formatParagraphs(description),
        [description]
    );
    const translationParagraphs = useMemo(
        () => formatParagraphs(translationText),
        [translationText]
    );

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
                {/* Left Column - Bulgarian Description */}
                <Card className="bg-card/70 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/70">
                        <CardTitle className="text-xl font-semibold py-1">
                         Описаниe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="min-h-[300px] rounded-xl border border-border/60 bg-muted/20 p-6 sm:p-8">
                            <div className="text-base sm:text-lg text-foreground font-serif">
                                {bulgarianParagraphs.length > 0 ? (
                                    bulgarianParagraphs
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        No description available.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column - Translation with Dropdown */}
                <Card className="bg-card/70 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/70">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <CardTitle className="text-xl font-semibold">
                                Translation
                            </CardTitle>
                            <Select
                                value={translationLanguage}
                                onValueChange={(value) =>
                                    setTranslationLanguage(value as TranslationLanguage)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Choose language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="de">German</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="min-h-[300px] rounded-xl border border-border/60 bg-muted/20 p-6 sm:p-8">
                            <div className="text-base sm:text-lg text-foreground font-serif">
                                {translationParagraphs.length > 0 ? (
                                    translationParagraphs
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        {translationText}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
