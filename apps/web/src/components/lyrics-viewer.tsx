type LyricsViewerProps = {
  lyrics: string;
}

export default function LyricsViewer({ lyrics }: LyricsViewerProps) {
  return (
    <div>
      <h1>Lyrics</h1>
      {lyrics}
    </div>
  )
}