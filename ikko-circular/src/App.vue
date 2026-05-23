<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const installPrompt = ref<any>(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    installPrompt.value = null
  })
})

async function install() {
  console.log('installPrompt', installPrompt.value)
  if (!installPrompt.value) return
  installPrompt.value.prompt()
  const { outcome } = await installPrompt.value.userChoice
  if (outcome === 'accepted') installPrompt.value = null
}
</script>

<template>
  <button v-if="installPrompt" class="install-btn" @click="install">
    Install App
  </button>
  <!-- <button class="install-btn" @click="install">
    Install App
  </button> -->
  <HelloWorld />
</template>

<style scoped>
.install-btn {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 6px 18px;
  border-radius: 20px;
  border: none;
  background: #863bff;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(134, 59, 255, 0.5);
  transition: background 0.15s, box-shadow 0.15s;
}
.install-btn:hover {
  background: #9d5eff;
  box-shadow: 0 4px 16px rgba(134, 59, 255, 0.7);
}
</style>
