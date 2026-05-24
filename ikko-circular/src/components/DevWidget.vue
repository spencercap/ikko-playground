<script setup lang="ts">
import { computed } from 'vue'
import { spinnerState } from '../composables/useSpinnerState'

const r2d = (r: number) => (r * 180 / Math.PI).toFixed(1)
const f2  = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(2)
const f1  = (n: number) => (n >= 0 ? ' ' : '') + n.toFixed(1)

const rows = computed(() => [
  { label: 'Pointer',  color: '#aaff00', vals: [
    { k: 'angle', v: r2d(spinnerState.pointer.angle) + '°' },
    { k: 'active', v: spinnerState.pointer.active ? 'yes' : 'no' },
  ]},
  { label: 'Tilt',     color: '#00cfff', vals: [
    { k: 'γ', v: f1(spinnerState.orient.gamma) + '°' },
    { k: 'β', v: f1(spinnerState.orient.beta)  + '°' },
  ]},
  { label: 'Accel X',  color: '#ff3344', vals: [{ k: 'x', v: f2(spinnerState.accel.x) + ' m/s²' }] },
  { label: 'Accel Y',  color: '#44ff66', vals: [{ k: 'y', v: f2(spinnerState.accel.y) + ' m/s²' }] },
  { label: 'Accel Z',  color: '#6677ff', vals: [{ k: 'z', v: f2(spinnerState.accel.z) + ' m/s²' }] },
])
</script>

<template>
  <div class="dev-widget">
    <div class="dev-title">DEV</div>
    <div v-for="row in rows" :key="row.label" class="dev-row">
      <span class="dev-swatch" :style="{ background: row.color }" />
      <span class="dev-label">{{ row.label }}</span>
      <span class="dev-vals">
        <span v-for="v in row.vals" :key="v.k" class="dev-val">
          <span class="dev-key">{{ v.k }}</span>{{ v.v }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dev-widget {
  position: fixed;
  bottom: 84px;
  left: 12px;
  background: rgba(10, 10, 18, 0.88);
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 10px 12px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #aaa;
  z-index: 500;
  min-width: 210px;
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.dev-title {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: #555;
  margin-bottom: 6px;
}

.dev-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 2px 0;
}

.dev-swatch {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  align-self: center;
}

.dev-label {
  width: 56px;
  color: #666;
  flex-shrink: 0;
}

.dev-vals {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dev-val {
  white-space: pre;
  color: #ddd;
}

.dev-key {
  color: #555;
  margin-right: 2px;
}
</style>
