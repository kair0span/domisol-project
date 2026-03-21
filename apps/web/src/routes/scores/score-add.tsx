import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { z } from "zod";
import { addScore, uploadFile, type CreateScore } from "#/lib/api";
import { useState } from "react";
import { Textarea } from "#/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  composer: z.string().min(1, "Composer is required"),
  lyricist: z.string().min(1, "Lyricist is required"),
  category: z.string().min(1, "Category is required"),
  key: z.string().min(1, "Key is required"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  lyrics: z.string().min(1, "Lyrics is required"),
  userId: z.string().min(1, "UserId is required"),
  file: z.any().refine((file) => file, "Score file is required"),
});

export const Route = createFileRoute("/scores/score-add")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      composer: "",
      lyricist: "",
      category: "",
      key: "",
      color: "",
      location: "",
      genre: "",
      description: "",
      date: "",
      lyrics: "",
      userId: "df63f948-1b5d-4f57-abf8-dea6f0d54307", // TODO: Get actual user ID from auth
      file: null,
    } as CreateScore & { file: File | null },
    onSubmit: async ({ value }) => {
      try {
        setIsUploading(true);
        setUploadError(null);

        // Upload file if selected
        if (value.file) {
          await uploadFile(value.file);
        }

        // Create score record (excluding file from the score data)
        const { file: _, ...scoreData } = value;
        await addScore(scoreData as CreateScore);
        router.navigate({ to: "/scores" });
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
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Add New Score</CardTitle>
            <CardDescription>
              Enter the details for the new musical score you want to add to
              your collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Title *
                  </label>
                  <Field name="title">
                    {(field) => {
                      const { errors, isTouched } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="title"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="Enter score title"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && isTouched && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="composer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Composer *
                  </label>
                  <Field name="composer">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="composer"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="Enter composer name"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lyricist"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lyricist
                  </label>
                  <Field name="lyricist">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="lyricist"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="Enter lyricist name"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Category
                  </label>
                  <Field name="category">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="category"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="e.g., братски, от Учителя, след 1944,"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="key"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Key
                  </label>
                  <Field name="key">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="key"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="e.g., C Dur, a moll"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="genre"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Genre
                  </label>
                  <Field name="genre">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="genre"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="e.g., vocal, instrumental"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="color"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Color
                  </label>
                  <Field name="color">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="color"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="Color code or name"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Location
                  </label>
                  <Field name="location">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="location"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            placeholder="Storage location"
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="date"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Date
                  </label>
                  <Field name="date">
                    {(field) => {
                      const { errors } = field.state.meta;
                      return (
                        <>
                          <Input
                            id="date"
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={() => field.handleBlur()}
                            className="mt-2"
                          />
                          {errors && errors.length > 0 && (
                            <span className="text-sm text-destructive">
                              {errors[0]?.message || "Invalid input"}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </Field>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <Field name="description">
                  {(field) => {
                    const { errors } = field.state.meta;
                    return (
                      <>
                        <Textarea
                          id="description"
                          className="flex min-h-[80px] w-full rounded-4xl border border-input bg-input/30 px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-2"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={() => field.handleBlur()}
                          placeholder="Enter additional notes or description about this score"
                         
                        />
                        {errors && errors.length > 0 && (
                          <span className="text-sm text-destructive">
                            {errors[0]?.message || "Invalid input"}
                          </span>
                        )}
                      </>
                    );
                  }}
                </Field>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lyrics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lyrics *
                </label>
                <Field name="lyrics">
                  {(field) => {
                    const { errors } = field.state.meta;
                    return (
                      <>
                        <Textarea
                          id="lyrics"
                          className="flex min-h-[120px] w-full rounded-4xl border border-input bg-input/30 px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-2"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={() => field.handleBlur()}
                          placeholder="Enter the lyrics for this score"
                        />
                        {errors && errors.length > 0 && (
                          <span className="text-sm text-destructive">
                            {errors[0]?.message || "Invalid input"}
                          </span>
                        )}
                      </>
                    );
                  }}
                </Field>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="file"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Score File *
                </label>
                <Field name="file">
                  {(field) => {
                    const { errors, isTouched } = field.state.meta;
                    return (
                      <>
                        <Input
                          id="file"
                          type="file"
                          accept=".xml,.musicxml,.mxl,.pdf,.jpg,.jpeg,.png"
                          className="cursor-pointer mt-2"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.handleChange(file || null);
                            setUploadError(null);
                          }}
                          onBlur={() => field.handleBlur()}
                        />
                        {field.state.value && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {field.state.value.name} (
                            {(field.state.value.size / 1024 / 1024).toFixed(2)}{" "}
                            MB)
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Supported formats: XML, MUSICXML, PDF, Images
                        </p>
                        {errors && errors.length > 0 && isTouched && (
                          <span className="text-sm text-destructive">
                            {errors[0]?.message || "Invalid input"}
                          </span>
                        )}
                        {uploadError && (
                          <p className="text-sm text-destructive">
                            {uploadError}
                          </p>
                        )}
                      </>
                    );
                  }}
                </Field>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Add Score"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
