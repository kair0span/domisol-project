import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Music2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Separator } from "#/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { cn } from "#/lib/utils";
import { addScore, uploadFile, type CreateScore } from "#/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleTrans: z.string().min(1, "Title Transliteration is required"),
  fileUrl: z.string().optional(),
  composer: z.string().min(1, "Composer is required"),
  lyricist: z.string().min(1, "Lyricist is required"),
  category: z.string().min(1, "Category is required"),
  key: z.string().min(1, "Key is required"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().min(1, "Description is required"),
  descriptionDe: z.string().min(1, "Description (DE) is required"),
  descriptionFr: z.string().min(1, "Description (FR) is required"),
  descriptionEn: z.string().min(1, "Description (EN) is required"),
  date: z.string().min(1, "Date is required"),
  lyrics: z.string().min(1, "Lyrics is required"),
  lyricsTrans: z.string().min(1, "Lyrics Transliteration is required"),
  lyricsDe: z.string().min(1, "Lyrics (DE) is required"),
  lyricsFr: z.string().min(1, "Lyrics (FR) is required"),
  lyricsEn: z.string().min(1, "Lyrics (EN) is required"),
  userId: z.string().min(1, "UserId is required"),
  file: z.any().refine((file) => file, "Score file is required"),
});

const labelClass =
  "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

/** Flex + gap is reliable; margin-based space-y can collapse next to some controls */
const fieldGroupClass = "flex flex-col gap-2";
const labelToControlClass = "flex flex-col gap-4";

export type ScoreAddModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void | Promise<void>;
};

export function ScoreAddModal({
  open,
  onOpenChange,
  onSuccess,
}: ScoreAddModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (open) {
      setUploadError(null);
      setFormKey((k) => k + 1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
          "[&>form]:flex [&>form]:min-h-0 [&>form]:flex-1 [&>form]:flex-col",
        )}
      >
        <div className="shrink-0 border-b border-border/80 bg-muted/30 px-5 py-4 sm:px-6">
          <DialogHeader className="gap-3 text-left sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
              aria-hidden
            >
              <Music2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                Add new score
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Add a score to your collection: metadata, lyrics, and an
                optional file (MusicXML, MXL).
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <ScoreAddForm
          key={formKey}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          uploadError={uploadError}
          setUploadError={setUploadError}
          onSuccess={onSuccess}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type ScoreAddFormProps = {
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
  uploadError: string | null;
  setUploadError: (v: string | null) => void;
  onSuccess?: () => void | Promise<void>;
  onClose: () => void;
};

function ScoreAddForm({
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
  onSuccess,
  onClose,
}: ScoreAddFormProps) {
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      titleTrans: "",
      composer: "",
      lyricist: "",
      category: "",
      key: "",
      color: "",
      location: "",
      genre: "",
      description: "",
      descriptionDe: "",
      descriptionFr: "",
      descriptionEn: "",
      date: "",
      lyrics: "",
      lyricsTrans: "",
      lyricsDe: "",
      lyricsFr: "",
      lyricsEn: "",
      userId: "9853673f-d1e6-4bf0-91a8-9418ad21c43a",
      file: null as File | null,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsUploading(true);
        setUploadError(null);

        let fileUrl = "";
        if (value.file) {
          const uploadResult = await uploadFile(value.file);
          fileUrl = uploadResult.url;
        }

        const { file: _, ...scoreData } = value;
        await addScore({ ...scoreData, fileUrl } as CreateScore);
        await onSuccess?.();
        onClose();
      } catch (error) {
        console.error("Failed to add score:", error);
        setUploadError(
          error instanceof Error ? error.message : "Upload failed",
        );
      } finally {
        setIsUploading(false);
      }
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        <div className="space-y-8">
          <section className="space-y-4" aria-labelledby="score-section-basic">
            <div className="space-y-1">
              <h3
                id="score-section-basic"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Basic information
              </h3>
              <p className="text-sm text-muted-foreground">
                Title and people behind the piece.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Field name="title">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-title" className={labelClass}>
                        Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-title"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Score title"
                        autoComplete="off"
                        aria-invalid={
                          !!field.state.meta.errors?.length &&
                          field.state.meta.isTouched
                        }
                      />
                    </div>
                    <FieldError field={field} requireTouched />
                  </div>
                )}
              </Field>
              <Field name="titleTrans">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-title-trans" className={labelClass}>
                        Title Transliteration <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-title-trans"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Score title transliteration"
                        autoComplete="off"
                        aria-invalid={
                          !!field.state.meta.errors?.length &&
                          field.state.meta.isTouched
                        }
                      />
                    </div>
                    <FieldError field={field} requireTouched />
                  </div>
                )}
              </Field>

              <Field name="composer">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-composer" className={labelClass}>
                        Composer <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-composer"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Composer name"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="lyricist">
                {(field) => (
                  <div  className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-lyricist" className={labelClass}>
                        Lyricist <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-lyricist"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Lyricist name"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section
            className="space-y-4"
            aria-labelledby="score-section-classification"
          >
            <div className="space-y-1">
              <h3
                id="score-section-classification"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Classification &amp; storage
              </h3>
              <p className="text-sm text-muted-foreground">
                How the score is categorized and where it lives.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Field name="category">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-category" className={labelClass}>
                        Category <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-category"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="e.g. братски, от Учителя, след 1944"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="genre">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-genre" className={labelClass}>
                        Genre <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-genre"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="e.g. vocal, instrumental"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="key">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-key" className={labelClass}>
                        Key <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-key"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="e.g. C major, A minor"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="color">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-color" className={labelClass}>
                        Color <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-color"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Color code or name"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="location">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-location" className={labelClass}>
                        Location <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-location"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                        placeholder="Physical or logical storage"
                        autoComplete="off"
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>

              <Field name="date">
                {(field) => (
                  <div className={fieldGroupClass}>
                    <div className={labelToControlClass}>
                      <label htmlFor="score-date" className={labelClass}>
                        Date <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="score-date"
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.handleBlur()}
                      />
                    </div>
                    <FieldError field={field} />
                  </div>
                )}
              </Field>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section
            className="space-y-4"
            aria-labelledby="score-section-content"
          >
            <div className="space-y-1">
              <h3
                id="score-section-content"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Text &amp; notes
              </h3>
              <p className="text-sm text-muted-foreground">
                Original text and translations for description and lyrics.
              </p>
            </div>

            <div className="space-y-8">
              <TextTypeGroup
                Field={Field}
                title="Descriptions"
                fields={[
                  {
                    name: "description",
                    id: "score-description",
                    label: "Description",
                    placeholder: "Notes about this score",
                  },
                  {
                    name: "descriptionDe",
                    id: "score-descriptionDe",
                    label: "Description (DE)",
                    placeholder: "German translation of description",
                  },
                  {
                    name: "descriptionFr",
                    id: "score-descriptionFr",
                    label: "Description (FR)",
                    placeholder: "French translation of description",
                  },
                  {
                    name: "descriptionEn",
                    id: "score-descriptionEn",
                    label: "Description (EN)",
                    placeholder: "English translation of description",
                  },
                ]}
                minHeightClass="min-h-[140px]"
              />
              <TextTypeGroup
                Field={Field}
                title="Lyrics"
                fields={[
                  {
                    name: "lyrics",
                    id: "score-lyrics",
                    label: "Lyrics",
                    placeholder: "Full lyrics",
                  },
                  {
                    name: "lyricsTrans",
                    id: "score-lyricsTrans",
                    label: "Lyrics Transliteration",
                    placeholder: "Transliteration of lyrics",
                  },
                  {
                    name: "lyricsDe",
                    id: "score-lyricsDe",
                    label: "Lyrics (DE)",
                    placeholder: "German translation of lyrics",
                  },
                  {
                    name: "lyricsFr",
                    id: "score-lyricsFr",
                    label: "Lyrics (FR)",
                    placeholder: "French translation of lyrics",
                  },
                  {
                    name: "lyricsEn",
                    id: "score-lyricsEn",
                    label: "Lyrics (EN)",
                    placeholder: "English translation of lyrics",
                  },
                ]}
                minHeightClass="min-h-[200px]"
              />
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section className="space-y-4" aria-labelledby="score-section-file">
            <div className="space-y-1">
              <h3
                id="score-section-file"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Score file
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload MusicXML, PDF, or an image (required).
              </p>
            </div>

            <Field name="file">
              {(field) => (
                <div className={cn(fieldGroupClass, "gap-3")}>
                  <label htmlFor="score-file" className={labelClass}>
                    File <span className="text-destructive">*</span>
                  </label>
                  <div
                    className={cn(
                      "flex flex-col gap-4 rounded-2xl border border-dashed border-input bg-muted/20 px-4 py-5 sm:px-5 sm:py-6 transition-colors",
                      "hover:bg-muted/30 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
                      uploadError &&
                        "border-destructive/50 bg-destructive/[0.06] focus-within:border-destructive/60",
                    )}
                  >
                    <Input
                      id="score-file"
                      type="file"
                      accept=".xml,.musicxml,.mxl,.pdf,.jpg,.jpeg,.png"
                      className="cursor-pointer border-0 bg-transparent p-0 file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/15"
                      onClick={(e) => {
                        // Allow choosing the same file again so onChange fires and errors clear.
                        (e.currentTarget as HTMLInputElement).value = "";
                      }}
                      onChange={(e) => {
                        setUploadError(null);
                        const file = e.target.files?.[0];
                        field.handleChange(file ?? null);
                      }}
                      onBlur={() => field.handleBlur()}
                    />
                    {field.state.value ? (
                      <p className="text-sm text-muted-foreground">
                        Selected:{" "}
                        <span className="font-medium text-foreground">
                          {field.state.value.name}
                        </span>{" "}
                        ({(field.state.value.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Supported: XML, MusicXML, MXL, PDF, JPG, PNG
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      <FieldError field={field} requireTouched />
                      {uploadError ? (
                        <p
                          className="text-sm text-destructive leading-snug"
                          role="alert"
                          aria-live="polite"
                        >
                          {uploadError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </Field>
          </section>
        </div>
      </div>

      <DialogFooter className="shrink-0 gap-2 border-t border-border/80 bg-background/95 px-5 py-4 backdrop-blur-sm sm:flex-row sm:justify-end sm:px-6">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? "Saving…" : "Add score"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function TextTypeGroup({
  Field,
  title,
  fields,
  minHeightClass,
}: {
  Field: any;
  title: string;
  fields: Array<{
    name:
      | "description"
      | "descriptionDe"
      | "descriptionFr"
      | "descriptionEn"
      | "lyrics"
      | "lyricsTrans"
      | "lyricsDe"
      | "lyricsFr"
      | "lyricsEn";
    id: string;
    label: string;
    placeholder: string;
  }>;
  minHeightClass: string;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-muted/20 p-5 sm:p-6">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="flex flex-col gap-6 sm:gap-7">
        {fields.map((item) => (
          <TextAreaField
            key={item.name}
            Field={Field}
            name={item.name}
            id={item.id}
            label={item.label}
            placeholder={item.placeholder}
            minHeightClass={minHeightClass}
          />
        ))}
      </div>
    </div>
  );
}

function TextAreaField({
  Field,
  name,
  id,
  label,
  placeholder,
  minHeightClass,
}: {
  Field: any;
  name:
    | "description"
    | "descriptionDe"
    | "descriptionFr"
    | "descriptionEn"
    | "lyrics"
    | "lyricsTrans"
    | "lyricsDe"
    | "lyricsFr"
    | "lyricsEn";
  id: string;
  label: string;
  placeholder: string;
  minHeightClass: string;
}) {
  return (
    <Field name={name}>
      {(field: {
        state: {
          value: string;
          meta: { errors?: unknown; isTouched?: boolean };
        };
        handleChange: (value: string) => void;
        handleBlur: () => void;
      }) => (
        <div className={cn(fieldGroupClass, "gap-3")}>
          <div className={cn(labelToControlClass, "gap-3")}>
            <label htmlFor={id} className={labelClass}>
              {label} <span className="text-destructive">*</span>
            </label>
            <Textarea
              id={id}
              className={cn(
                minHeightClass,
                "min-w-0 w-full resize-y rounded-2xl border border-input bg-input/30 px-3 py-3 text-base leading-relaxed transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-4 sm:py-3.5 md:text-sm",
              )}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => field.handleBlur()}
              placeholder={placeholder}
            />
          </div>
          <FieldError field={field} />
        </div>
      )}
    </Field>
  );
}

function fieldFirstMessage(errors: unknown): string | undefined {
  if (!Array.isArray(errors) || errors.length === 0) return undefined;
  const first = errors[0];
  if (first && typeof first === "object" && "message" in first) {
    const m = (first as { message?: unknown }).message;
    return typeof m === "string" ? m : undefined;
  }
  return undefined;
}

function FieldError({
  field,
  requireTouched,
}: {
  field: {
    state: {
      meta: { errors?: unknown; isTouched?: boolean };
    };
  };
  requireTouched?: boolean;
}) {
  const { errors, isTouched } = field.state.meta;
  const msg = fieldFirstMessage(errors);
  if (!msg) return null;
  if (requireTouched && !isTouched) return null;
  return <span className="text-sm text-destructive">{msg}</span>;
}

export function ScoreAddRoute() {
  const navigate = useNavigate();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <ScoreAddModal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          navigate({ to: "/scores" });
        }
      }}
      onSuccess={() => router.invalidate()}
    />
  );
}
