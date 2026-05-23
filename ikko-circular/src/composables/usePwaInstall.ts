import { onMounted, ref } from 'vue'

export function usePwaInstall() {
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
    if (!installPrompt.value) return
    installPrompt.value.prompt()
    const { outcome } = await installPrompt.value.userChoice
    if (outcome === 'accepted') installPrompt.value = null
  }

  return { installPrompt, install }
}
