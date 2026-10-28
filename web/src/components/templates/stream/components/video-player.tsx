export type TVideoPlayerProps = {
  streamUrl: string
  posterUrl?: string
}

export const VideoPlayer = ({ streamUrl, posterUrl }: TVideoPlayerProps) => {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background shadow-glow">
      <video
        src={streamUrl}
        poster={posterUrl}
        controls
        autoPlay
        playsInline
        className="aspect-video w-full bg-background"
      />
    </div>
  )
}
