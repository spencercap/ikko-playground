<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)

const pointer = reactive({ angle: 0, active: false })
const orient  = reactive({ gamma: 0, beta: 90 })       // degrees
const accel   = reactive({ x: 0, y: 0, z: 9.8 })       // m/s²

// Each layer: source drives angle, different radius/colour per data source
const layers = [
  { angle: 0,       smoothAngle: 0,       trackSpeed: 6.0, radius: 0.35, size: 14, color: '#aaff00', shadow: 'rgba(170,255,0,0.7)',   source: 'pointer' },
  { angle: Math.PI, smoothAngle: Math.PI, trackSpeed: 3.5, radius: 0.20, size: 10, color: '#00cfff', shadow: 'rgba(0,207,255,0.7)',   source: 'orient'  },
  { angle: 0,       smoothAngle: 0,       trackSpeed: 8.0, radius: 0.62, size:  9, color: '#ff3344', shadow: 'rgba(255,51,68,0.7)',   source: 'accelX'  },
  { angle: 0,       smoothAngle: 0,       trackSpeed: 8.0, radius: 0.73, size:  9, color: '#44ff66', shadow: 'rgba(68,255,102,0.7)',  source: 'accelY'  },
  { angle: 0,       smoothAngle: 0,       trackSpeed: 8.0, radius: 0.85, size:  9, color: '#6677ff', shadow: 'rgba(102,119,255,0.7)', source: 'accelZ'  },
]

const positions = reactive(layers.map(() => ({ x: 0, y: 0 })))

let raf = 0
let lastTime = 0
let half = 0

function updateSize() {
  if (containerRef.value) half = containerRef.value.offsetWidth / 2
}

function onPointerDown(e: PointerEvent) {
  containerRef.value?.setPointerCapture(e.pointerId)
  pointer.active = true
  updateAngle(e)
}

function onPointerMove(e: PointerEvent) {
  if (!pointer.active) return
  updateAngle(e)
}

function updateAngle(e: PointerEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  pointer.angle = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2))
}

function onPointerEnd(e: PointerEvent) {
  containerRef.value?.releasePointerCapture(e.pointerId)
  pointer.active = false
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  orient.gamma = e.gamma ?? 0
  orient.beta  = e.beta  ?? 90
}

function onDeviceMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity
  if (!a) return
  accel.x = a.x ?? 0
  accel.y = a.y ?? 0
  accel.z = a.z ?? 9.8
}

function loop(time: number) {
  const dt = Math.min((time - lastTime) / 1000, 0.05)
  lastTime = time

  const tiltMag = Math.hypot(orient.gamma, orient.beta - 90)

  layers.forEach((layer, i) => {
    switch (layer.source) {
      case 'pointer':
        if (pointer.active) layer.angle = pointer.angle
        break
      case 'orient':
        // atan2(beta−90, gamma): 1:1 tilt-direction → circle position
        layer.angle = Math.atan2(orient.beta - 90, orient.gamma)
        break
      case 'accelX':
        // map ±9.8 m/s² → ±π (sweeps a semicircle per axis)
        layer.angle = (accel.x / 9.8) * Math.PI
        break
      case 'accelY':
        layer.angle = (accel.y / 9.8) * Math.PI
        break
      case 'accelZ':
        layer.angle = (accel.z / 9.8) * Math.PI
        break
    }

    // Smooth shortest-path lerp
    const diff = layer.angle - layer.smoothAngle
    layer.smoothAngle += Math.atan2(Math.sin(diff), Math.cos(diff)) * layer.trackSpeed * dt

    // Orient dot radius expands with tilt magnitude
    const r = layer.source === 'orient'
      ? (layer.radius + Math.min(tiltMag / 90, 1) * 0.08) * half
      : layer.radius * half

    positions[i].x = Math.cos(layer.smoothAngle) * r
    positions[i].y = Math.sin(layer.smoothAngle) * r
  })

  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  updateSize()
  const el = containerRef.value!
  el.addEventListener('pointerdown',   onPointerDown)
  el.addEventListener('pointermove',   onPointerMove)
  el.addEventListener('pointerup',     onPointerEnd)
  el.addEventListener('pointercancel', onPointerEnd)
  window.addEventListener('deviceorientation', onDeviceOrientation as EventListener)
  window.addEventListener('devicemotion',      onDeviceMotion      as EventListener)
  window.addEventListener('resize',            updateSize)
  lastTime = performance.now()
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  const el = containerRef.value
  el?.removeEventListener('pointerdown',   onPointerDown)
  el?.removeEventListener('pointermove',   onPointerMove)
  el?.removeEventListener('pointerup',     onPointerEnd)
  el?.removeEventListener('pointercancel', onPointerEnd)
  window.removeEventListener('deviceorientation', onDeviceOrientation as EventListener)
  window.removeEventListener('devicemotion',      onDeviceMotion      as EventListener)
  window.removeEventListener('resize',            updateSize)
})
</script>

<template>
  <div class="spinner-wrap" ref="containerRef">
    <div class="spinner">
      <div class="spinner-inner"></div>
    </div>

    <div class="orbit-layer">
      <div
        v-for="(pos, i) in positions"
        :key="i"
        class="orbit-dot"
        :style="{
          width:      `${layers[i].size}px`,
          height:     `${layers[i].size}px`,
          background:  layers[i].color,
          boxShadow:  `0 0 10px 3px ${layers[i].shadow}`,
          transform:  `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.spinner-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  touch-action: none;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  container-type: inline-size;
  border: 4px solid limegreen;
  border-top: 4px solid plum;
  border-radius: 50%;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner-inner {
  width: 50cqw;
  aspect-ratio: 1 / 1;
  border: 4px solid orangered;
  border-top: 4px solid skyblue;
  border-radius: 50%;
  animation: spin 13s linear infinite reverse;
}

.orbit-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbit-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  will-change: transform;
}
</style>
