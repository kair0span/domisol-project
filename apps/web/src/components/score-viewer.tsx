import { fetchScoreFile } from "#/lib/api";
import type { ScoreResponse } from "@repo/schemas";
import { Minus, Plus } from "lucide-react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { useCallback, useEffect, useRef, useState } from "react";

type ScoreViewerProps = {
  score: ScoreResponse;
};

const MIN_ZOOM = 0.45;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export default function ScoreViewer({ score }: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const isLoadedRef = useRef(false);
  const zoomRef = useRef(1);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderScore = useCallback(() => {
    const osmd = osmdRef.current;
    if (!osmd || !isLoadedRef.current) {
      return;
    }

    const isDarkTheme = document.documentElement.classList.contains("dark");
    osmd.setOptions({
      drawTitle: true,
      darkMode: isDarkTheme,
      autoResize: false,
    } as Record<string, unknown>);
    osmd.zoom = zoomRef.current;
    osmd.render();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let isMounted = true;
    let resizeFrame = 0;
    setIsLoading(true);
    setError(null);
    isLoadedRef.current = false;

    const osmd = new OpenSheetMusicDisplay(container, {
      drawTitle: true,
      autoResize: false,
    });
    osmdRef.current = osmd;

    const load = async () => {
      try {
        const xml = await fetchScoreFile(score.id);
        if (!isMounted) {
          return;
        }

        await osmd.load(xml);
        if (!isMounted) {
          return;
        }

        isLoadedRef.current = true;
        renderScore();
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError("Unable to display this score right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    const observer = new ResizeObserver(() => {
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = requestAnimationFrame(() => {
        if (isMounted) {
          renderScore();
        }
      });
    });

    observer.observe(container);

    const themeObserver = new MutationObserver(() => {
      if (isMounted) {
        renderScore();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      isMounted = false;
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      observer.disconnect();
      themeObserver.disconnect();
      container.innerHTML = "";
      isLoadedRef.current = false;
      osmdRef.current = null;
    };
  }, [score.id, renderScore]);

  useEffect(() => {
    zoomRef.current = zoom;
    if (!isLoading && !error) {
      renderScore();
    }
  }, [zoom, isLoading, error, renderScore]);

  const zoomOut = () => {
    setZoom((current) =>
      Number(Math.max(MIN_ZOOM, current - ZOOM_STEP).toFixed(2)),
    );
  };

  const zoomIn = () => {
    setZoom((current) =>
      Number(Math.min(MAX_ZOOM, current + ZOOM_STEP).toFixed(2)),
    );
  };
  const zoomPercent = Math.round(zoom * 100);
  const controlsDisabled = isLoading || Boolean(error);

  return (
    <section className="relative min-h-[320px] rounded-md border border-border/90 overflow-hidden sm:min-h-[380px]">
      <div className="pointer-events-none absolute right-5 top-5 z-20 sm:right-6 sm:top-6">
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-background/75 p-1 backdrop-blur">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM || controlsDisabled}
            aria-label="Zoom out score"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/90 transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="min-w-10 px-1.5 text-center text-[12px] font-semibold tracking-wide text-foreground/85">
            {zoomPercent}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM || controlsDisabled}
            aria-label="Zoom in score"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/90 transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/55 text-sm text-muted-foreground backdrop-blur-[2px]">
          Loading score...
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/55 px-4 text-center text-sm text-destructive backdrop-blur-[2px]">
          {error}
        </div>
      )}

      <div
        ref={containerRef}
        className="min-h-[300px] overflow-x-hidden sm:min-h-[360px]"
      />
    </section>
  );
}
