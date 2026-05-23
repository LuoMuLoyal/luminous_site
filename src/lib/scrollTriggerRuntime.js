let runtimePromise

async function loadScrollTriggerRuntime() {
  if (!import.meta.client) {
    return null
  }

  if (!runtimePromise) {
    runtimePromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.default
      const { ScrollTrigger } = scrollTriggerModule

      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.config({
        limitCallbacks: true,
      })

      return { gsap, ScrollTrigger }
    })
  }

  return runtimePromise
}

export async function withScrollTriggerRuntime(callback) {
  const runtime = await loadScrollTriggerRuntime()

  if (!runtime) {
    return
  }

  return callback(runtime)
}

export async function refreshScrollTrigger() {
  return withScrollTriggerRuntime(({ ScrollTrigger }) => {
    ScrollTrigger.refresh()
  })
}

export async function killAllScrollTriggers() {
  return withScrollTriggerRuntime(({ ScrollTrigger }) => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })
}
