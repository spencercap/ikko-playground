import { reactive, ref } from 'vue'

export const config = reactive({
  invertPointer: false,
  invertOrient:  false,
  invertAccelX:  false,
  invertAccelY:  false,
  invertAccelZ:  false,
})

export const showConfig = ref(false)
export const showDev    = ref(false)

export function useSpinnerConfig() {
  return { config, showConfig, showDev }
}
