import Tres from '@tresjs/core'

function isLowEndDevice() {
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return true
  }

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true
  }

  return false
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!isLowEndDevice()) {
    nuxtApp.vueApp.use(Tres)
  }
})
