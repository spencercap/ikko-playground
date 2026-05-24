<script setup lang="ts">
import { useSpinnerConfig } from '../composables/useSpinnerConfig'

const { config, showConfig, showDev } = useSpinnerConfig()

const toggles = [
  { key: 'invertPointer' as const, label: 'Pointer',  color: '#aaff00' },
  { key: 'invertOrient'  as const, label: 'Tilt',     color: '#00cfff' },
  { key: 'invertAccelX'  as const, label: 'Accel X',  color: '#ff3344' },
  { key: 'invertAccelY'  as const, label: 'Accel Y',  color: '#44ff66' },
  { key: 'invertAccelZ'  as const, label: 'Accel Z',  color: '#6677ff' },
]
</script>

<template>
  <Teleport to="body">
    <div v-if="showConfig" class="modal-backdrop" @click.self="showConfig = false">
      <div class="modal">
        <div class="modal-header">
          <span>Settings</span>
          <button class="modal-close" @click="showConfig = false">✕</button>
        </div>

        <div class="modal-section-label">Invert angle</div>
        <div class="toggle-list">
          <label v-for="t in toggles" :key="t.key" class="toggle-row">
            <span class="dot-swatch" :style="{ background: t.color }" />
            <span class="toggle-label">{{ t.label }}</span>
            <span class="toggle-switch">
              <input type="checkbox" v-model="config[t.key]" />
              <span class="track" />
            </span>
          </label>
        </div>

        <div class="modal-divider" />

        <label class="toggle-row">
          <span class="toggle-label">Dev widget</span>
          <span class="toggle-switch">
            <input type="checkbox" v-model="showDev" />
            <span class="track" />
          </span>
        </label>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding-bottom: 80px;
}

.modal {
  background: #1a1a24;
  border: 1px solid #2e2e3e;
  border-radius: 16px;
  padding: 20px;
  width: min(340px, 92vw);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #e0e0f0;
}

.modal-close {
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
}

.modal-section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
}

.modal-divider {
  border: none;
  border-top: 1px solid #2e2e3e;
  margin: 0;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  cursor: pointer;
}

.dot-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.toggle-label {
  flex: 1;
  font-size: 14px;
  color: #ccc;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.track {
  position: absolute;
  inset: 0;
  border-radius: 11px;
  background: #333;
  transition: background 0.2s;
}
.track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.toggle-switch input:checked + .track {
  background: #863bff;
}
.toggle-switch input:checked + .track::after {
  transform: translateX(18px);
}
</style>
