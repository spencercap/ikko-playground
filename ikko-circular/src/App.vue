<script setup lang="ts">
import { onMounted } from 'vue'
import Spinner from './components/spinner/Spinner.vue'
import { usePwaInstall } from './composables/usePwaInstall'

const { installPrompt, install } = usePwaInstall()

onMounted(() => {
  ;(screen.orientation as any)?.lock('portrait').catch(() => {})
})
</script>

<template>
  <button v-if="installPrompt" class="install-btn" @click="install">
    Install App
  </button>
  <Spinner />
</template>
