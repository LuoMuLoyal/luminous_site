import { onBeforeUnmount, onMounted, watch } from 'vue'

import { motionTokens } from '../content/siteContent'
import { animationLevel, isAnimationEnabled, isLowAnimation, isMediumAnimation, isHighAnimation, canUseScrollTrigger } from './useAnimationLevel'
import { killAllScrollTriggers, withScrollTriggerRuntime } from '../lib/scrollTriggerRuntime'

export function usePageMotion(rootRef) {
  let ctx

  function resolveRevealStart(item, fallbackPercent) {
    const viewportHeight = window.innerHeight || 0
    if (!viewportHeight || !item?.getBoundingClientRect) {
      return `top ${fallbackPercent}%`
    }

    const itemHeight = item.getBoundingClientRect().height || 0
    const ratio = itemHeight / viewportHeight

    // Large blocks should reveal later than small cards, but not too delayed.
    if (ratio >= 0.9) {
      return 'top 80%'
    }
    if (ratio >= 0.7) {
      return 'top 84%'
    }
    if (ratio >= 0.5) {
      return 'top 87%'
    }
    if (ratio >= 0.35) {
      return 'top 89%'
    }
    return `top ${fallbackPercent}%`
  }

  async function setupAnimations() {
    if (!import.meta.client || !rootRef.value) {
      return
    }

    await withScrollTriggerRuntime(async ({ gsap, ScrollTrigger }) => {
      if (ctx) {
        ctx.revert()
        await killAllScrollTriggers()
      }

      ctx = gsap.context(() => {
        if (isAnimationEnabled.value) {
          const heroItems = gsap.utils.toArray('[data-hero-item]')

          if (heroItems.length) {
            if (isLowAnimation.value) {
              gsap.from(heroItems, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
              })
            } else if (isMediumAnimation.value) {
              gsap.from(heroItems, {
                opacity: 0,
                y: 30,
                scale: 0.98,
                duration: motionTokens.heroDuration,
                stagger: motionTokens.heroStagger,
                ease: 'power3.out',
              })
            } else if (isHighAnimation.value) {
              gsap.from(heroItems, {
                opacity: 0,
                y: 36,
                scale: 0.96,
                duration: motionTokens.heroDuration,
                stagger: motionTokens.heroStagger,
                ease: 'power3.out',
              })
            }
          }
        }

        if (canUseScrollTrigger.value) {
          const animateItems = gsap.utils.toArray('[data-animate]')

          if (animateItems.length) {
            animateItems.forEach((item) => {
              const animateType = item.getAttribute('data-animate')

              const animationConfig = {
                opacity: 0,
                duration: isLowAnimation.value ? 0.35 : motionTokens.revealDuration,
                ease: isLowAnimation.value ? 'power2.out' : 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: resolveRevealStart(item, isLowAnimation.value ? 95 : 90),
                  toggleActions: 'play none none none',
                },
              }

              if (animateType === 'fade-up') {
                animationConfig.y = isLowAnimation.value ? 24 : (isMediumAnimation.value ? 36 : 48)
              } else if (animateType === 'zoom-in') {
                animationConfig.scale = isLowAnimation.value ? 0.97 : (isMediumAnimation.value ? 0.95 : 0.92)
                animationConfig.y = isLowAnimation.value ? 12 : (isMediumAnimation.value ? 18 : 24)
              }

              gsap.from(item, animationConfig)
            })
          }

          if (!isLowAnimation.value) {
            const allSections = gsap.utils.toArray('section, .card, .glass-section, .home-pulse-card, .teaser-card, .runtime-shot-card, .feature-card')

            if (allSections.length) {
              allSections.forEach((section, index) => {
                if (!section.hasAttribute('data-animate') && !section.hasAttribute('data-hero-item')) {
                  gsap.from(section, {
                    opacity: 0,
                    y: isMediumAnimation.value ? 30 : 40,
                    scale: isMediumAnimation.value ? 0.98 : 0.96,
                    duration: isMediumAnimation.value ? 0.8 : 1.0,
                    ease: 'power3.out',
                    delay: index * (isMediumAnimation.value ? 0.03 : 0.05),
                    scrollTrigger: {
                      trigger: section,
                      start: resolveRevealStart(
                        section,
                        isMediumAnimation.value ? 92 : 88,
                      ),
                      toggleActions: 'play none none none',
                    },
                  })
                }
              })
            }
          }
        }
      }, rootRef.value)
    })
  }

  onMounted(() => {
    void setupAnimations()
  })

  watch(animationLevel, () => {
    void setupAnimations()
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    void killAllScrollTriggers()
  })
}
