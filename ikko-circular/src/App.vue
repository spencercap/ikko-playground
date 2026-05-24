<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Spinner      from './components/spinner/Spinner.vue'
import ConfigModal  from './components/ConfigModal.vue'
import DevWidget    from './components/DevWidget.vue'
import { usePwaInstall }    from './composables/usePwaInstall'
import { useSpinnerConfig } from './composables/useSpinnerConfig'

const { installPrompt, install } = usePwaInstall()
const { showConfig, showDev }    = useSpinnerConfig()

const showGear = ref(false)

let longPressTimer: ReturnType<typeof setTimeout> | null = null

function onPressStart() {
  longPressTimer = setTimeout(() => {
    showGear.value = !showGear.value
  }, 600)
}

function onPressEnd() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

onMounted(() => {
  ;(screen.orientation as any)?.lock('portrait').catch(() => {})
  window.addEventListener('pointerdown', onPressStart)
  window.addEventListener('pointerup',   onPressEnd)
  window.addEventListener('pointermove', onPressEnd)
  window.addEventListener('pointercancel', onPressEnd)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', onPressStart)
  window.removeEventListener('pointerup',   onPressEnd)
  window.removeEventListener('pointermove', onPressEnd)
  window.removeEventListener('pointercancel', onPressEnd)
})
</script>

<template>
  <button v-if="installPrompt" class="install-btn" @click="install">
    Install App
  </button>

  <Spinner />

  <button v-if="showGear" class="gear-btn" @click="showConfig = true">⚙</button>

  <ConfigModal />
  <DevWidget v-if="showDev" />
</template>

<style scoped>
.gear-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #2e2e3e;
  background: rgba(20, 20, 30, 0.85);
  color: #888;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: #ccc;
    border-color: #555;
  }
}
</style>
