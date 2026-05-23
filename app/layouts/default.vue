<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'

import PageBackdrop from '../../src/components/PageBackdrop.vue'
import TopNav from '../../src/components/TopNav.vue'
import { syncAnimationLevelFromStorage, animationLevel, isAnimationEnabled, canShowBgFlow } from '../../src/composables/useAnimationLevel'
import { useSiteManifest } from '../../src/composables/useSiteManifest'
import { useSmoothScroll } from '../../src/composables/useSmoothScroll'
import { pageThemeTokens, siteContent } from '../../src/content/siteContent'
import { refreshScrollTrigger } from '../../src/lib/scrollTriggerRuntime'

useSmoothScroll()
useSiteManifest()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const currentTheme = computed(() => pageThemeTokens[route.meta?.themeKey || 'home'])

const shellStyle = computed(() => ({
  '--route-accent': currentTheme.value.accent,
  '--route-accent-secondary': currentTheme.value.accentSecondary,
  '--route-accent-tertiary': currentTheme.value.accentTertiary,
  '--route-glow': currentTheme.value.glow,
  '--route-glow-secondary': currentTheme.value.glowSecondary,
  '--route-mesh': currentTheme.value.mesh,
  '--route-border': currentTheme.value.border,
  background: currentTheme.value.background,
}))

const pageTitle = computed(() =>
  route.meta?.title ? `${route.meta.title} · Luminous` : 'Luminous · 智慧用药助手',
)

useHead(() => ({
  title: pageTitle.value,
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: `${runtimeConfig.app.baseURL}favicon.svg`,
    },
  ],
}))

function updateBodyClasses() {
  if (!import.meta.client) {
    return
  }

  document.body.classList.remove(
    'animation-level-none',
    'animation-level-low',
    'animation-level-medium',
    'animation-level-high',
    'has-bg-animation',
    'has-card-animation',
  )

  document.body.classList.add(`animation-level-${animationLevel.value}`)

  if (canShowBgFlow.value) {
    document.body.classList.add('has-bg-animation')
  }

  if (isAnimationEnabled.value) {
    document.body.classList.add('has-card-animation')
  }
}

onMounted(() => {
  syncAnimationLevelFromStorage()
  updateBodyClasses()
})

watch(animationLevel, () => {
  updateBodyClasses()
  void refreshScrollTrigger()
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    void refreshScrollTrigger()
  },
)
</script>

<template>
  <div class="site-shell" :style="shellStyle">
    <PageBackdrop :theme="currentTheme" />
    <TopNav :brand="siteContent.brand" :nav-items="siteContent.navItems" />

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <NuxtLink to="/" class="site-footer__brand">
          <img src="/favicon.svg" alt="" width="36" height="36" />
          <div>
            <strong>{{ siteContent.brand.name }}</strong>
            <span>{{ siteContent.brand.cnName }}</span>
          </div>
        </NuxtLink>

        <div class="site-footer__copy">
          <p>
            围绕识别、提醒、历史记录与安全辅助，持续提供清晰一致的产品信息。
          </p>
          <small>
            AI 解读与安全辅助仅作信息参考，不替代专业医生或药师建议。
          </small>
        </div>

        <nav class="site-footer__links" aria-label="Footer">
          <NuxtLink
            v-for="item in siteContent.footerLinks"
            :key="item.to"
            :to="item.to"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="site-footer__beian">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          津ICP备2026003615号
        </a>
        <span aria-hidden="true"> | </span>
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=12011602300919"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" alt="" width="16" height="16" />
          津公网安备12011602300919号
        </a>
      </div>
    </footer>
  </div>
</template>
