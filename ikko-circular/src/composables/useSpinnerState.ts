import { reactive } from 'vue'

export const spinnerState = reactive({
  pointer: { angle: 0, active: false },
  orient:  { gamma: 0, beta: 90 },
  accel:   { x: 0, y: 0, z: 9.8 },
})
