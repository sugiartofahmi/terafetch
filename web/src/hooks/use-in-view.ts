import { useEffect, useRef } from 'react'

type TUseInViewOptions = {
  enabled?: boolean
  rootMargin?: string
  threshold?: number | Array<number>
  onInView: () => void
}

export const useInView = <T extends HTMLElement = HTMLDivElement>({
  enabled = true,
  rootMargin = '200px',
  threshold = 0,
  onInView,
}: TUseInViewOptions) => {
  const ref = useRef<T | null>(null)
  const onInViewRef = useRef(onInView)
  onInViewRef.current = onInView

  useEffect(() => {
    if (!enabled) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onInViewRef.current()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin, threshold])

  return ref
}
