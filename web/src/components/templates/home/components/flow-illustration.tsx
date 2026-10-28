import flowCluster from '@/assets/flow-cluster.webp'
import flowPill from '@/assets/flow-pill.webp'

export const FlowIllustration = () => {
  return (
    <section className="mt-8" aria-label="How TeraFetch works">
      <div
        aria-hidden="true"
        className="sheen relative overflow-hidden rounded-3xl border border-border bg-card/80 px-6 py-6 shadow-glow-soft backdrop-blur sm:px-10 sm:py-8"
      >
        <div className="animate-orb pointer-events-none absolute -left-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="animate-orb pointer-events-none absolute -bottom-24 -right-10 size-64 rounded-full bg-primary/10 blur-3xl [animation-delay:-3.5s]" />

        <div className="relative flex items-center justify-center gap-2 sm:gap-4">
          <div className="flex w-24 flex-col items-center sm:w-36">
            <img
              src={flowPill}
              alt=""
              className="animate-float w-full drop-shadow-float [animation-delay:-1.2s]"
            />
            <p className="mt-3 text-center text-caption font-medium text-muted-foreground sm:text-body-sm">
              Paste a share link
            </p>
          </div>

          <div className="relative mx-1 mb-7 h-0.5 flex-1 sm:mx-2">
            <div className="animate-dash absolute inset-0 rounded-full bg-dash-line" />
            <span className="flow-dot animate-flow-dot [animation-delay:0s]" />
            <span className="flow-dot animate-flow-dot [animation-delay:1s]" />
          </div>

          <div className="flex w-28 flex-col items-center sm:w-40">
            <img
              src={flowCluster}
              alt=""
              className="animate-float w-full drop-shadow-float [animation-delay:-0.4s]"
            />
            <p className="mt-3 text-center text-caption font-medium text-muted-foreground sm:text-body-sm">
              Browse · Download · Stream
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
