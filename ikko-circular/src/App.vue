<script setup lang="ts">
import { onMounted } from 'vue'
import Spinner from './components/spinner/Spinner.vue'
import { usePwaInstall } from './composables/usePwaInstall'

const { installPrompt, install } = usePwaInstall()

onMounted(() => {
  screen.orientation?.lock('portrait').catch(() => {
    // Silently ignore — lock only works in fullscreen PWA context
  })
})
</script>

<template>
  <button v-if="installPrompt" class="install-btn" @click="install">
    Install App
  </button>
  <Spinner />
</template>
