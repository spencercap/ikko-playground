<script setup lang="ts">
import Spinner from './components/Spinner.vue'
import { usePwaInstall } from './composables/usePwaInstall'

const { installPrompt, install } = usePwaInstall()
</script>

<template>
  <button v-if="installPrompt" class="install-btn" @click="install">
    Install App
  </button>
  <Spinner />
</template>
