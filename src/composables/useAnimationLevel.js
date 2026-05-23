import { ref, computed } from 'vue'

export const animationLevel = ref('low')

export const animationLevels = [
  { value: 'none', label: '无', description: '完全关闭动画' },
  { value: 'low', label: '低', description: '极简动画，低端机流畅' },
  { value: 'medium', label: '中', description: '标准动画效果' },
  { value: 'high', label: '高', description: '极致视觉体验' },
]

let hydratedFromStorage = false

export const setAnimationLevel = (level) => {
  animationLevel.value = level
  if (import.meta.client) {
    localStorage.setItem('animationLevel', level)
  }
}

export const syncAnimationLevelFromStorage = () => {
  if (!import.meta.client || hydratedFromStorage) {
    return
  }

  const storedLevel = localStorage.getItem('animationLevel')

  if (animationLevels.some((level) => level.value === storedLevel)) {
    animationLevel.value = storedLevel
  }

  hydratedFromStorage = true
}

export const isAnimationEnabled = computed(() => {
  return animationLevel.value !== 'none'
})

export const isLowAnimation = computed(() => {
  return animationLevel.value === 'low'
})

export const isMediumAnimation = computed(() => {
  return animationLevel.value === 'medium'
})

export const isHighAnimation = computed(() => {
  return animationLevel.value === 'high'
})

export const canShowFloatShapes = computed(() => {
  return animationLevel.value === 'medium' || animationLevel.value === 'high'
})

export const canShowBgFlow = computed(() => {
  return animationLevel.value === 'high'
})

export const canUseScrollTrigger = computed(() => {
  return animationLevel.value === 'medium' || animationLevel.value === 'high'
})
