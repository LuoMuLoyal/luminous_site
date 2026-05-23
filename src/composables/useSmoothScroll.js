import { onBeforeUnmount, onMounted } from 'vue'

import { refreshScrollTrigger } from '../lib/scrollTriggerRuntime'

export function useSmoothScroll() {
  let resizeObserver

  onMounted(() => {
    if (!import.meta.client) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let resizeTimer
    resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        void refreshScrollTrigger()
      }, 200)
    })

    resizeObserver.observe(document.body)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })
}
