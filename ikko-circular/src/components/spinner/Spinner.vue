<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)

const pointer = reactive({ angle: 0, active: false })
const accel   = reactive({ x: 0, y: 0, z: 9.8 })

const layers = [
  { angle: 0,       smoothAngle: 0,       trackSpeed: 6.0, radius: 0.30, size: 16, color: '#aaff00', shadow: 'rgba(170,255,0,0.7)'  },
  { angle: Math.PI, smoothAngle: Math.PI, trackSpeed: 3.5, radius: 0.17, size: 10, color: '#00cfff', shadow: 'rgba(0,207,255,0.7)'  },
]

const positions = reactive(layers.map(() => ({ x: 0, y: 0 })))

let raf = 0
let lastTime = 0
let half = 0

function updateSize() {
  if (containerRef.value) half = containerRef.value.offsetWidth / 2
}

function onPointerMove(e: PointerEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width  / 2
  const cy = rect.top  + rect.height / 2
  pointer.angle  = Math.atan2(e.clientY - cy, e.clientX - cx)
  pointer.active = true
}

function onPointerEnd() { pointer.active = false }

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

  layers.forEach((layer, i) => {
    // Only advance the target when pointer is active
    if (pointer.active) {
      layer.angle = pointer.angle
    }

    // Smooth shortest-path lerp — never takes the long way around 0/360
    const diff = layer.angle - layer.smoothAngle
    layer.smoothAngle += Math.atan2(Math.sin(diff), Math.cos(diff)) * layer.trackSpeed * dt

    // Accel: x tilts angle, z bumps radius, y drags vertically
    const angleOffset  = (accel.x / 10) * (i === 0 ?  1.0 : -0.7)
    const radiusBump   = (Math.abs(accel.z) / 10) * 0.06
    const verticalDrag = (accel.y / 10) * half * 0.12

    const r = (layer.radius + radiusBump) * half
    const a = layer.smoothAngle + angleOffset

    positions[i].x = Math.cos(a) * r
    positions[i].y = Math.sin(a) * r + verticalDrag
  })

  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  updateSize()
  window.addEventListener('pointermove',   onPointerMove)
  window.addEventListener('pointerup',     onPointerEnd)
  window.addEventListener('pointercancel', onPointerEnd)
  window.addEventListener('pointerleave',  onPointerEnd)
  window.addEventListener('devicemotion',  onDeviceMotion as EventListener)
  window.addEventListener('resize',        updateSize)
  lastTime = performance.now()
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove',   onPointerMove)
  window.removeEventListener('pointerup',     onPointerEnd)
  window.removeEventListener('pointercancel', onPointerEnd)
  window.removeEventListener('pointerleave',  onPointerEnd)
  window.removeEventListener('devicemotion',  onDeviceMotion as EventListener)
  window.removeEventListener('resize',        updateSize)
})
</script>

<template>
  <!-- Wrapper holds both the spinning ring and the orbit overlay at the same size -->
  <div class="spinner-wrap" ref="containerRef">
    <div class="spinner">
      <div class="spinner-inner"></div>
    </div>

    <!-- Separate layer — NOT a child of .spinner, so it never inherits the spin rotation -->
    <div class="orbit-layer">
      <div
        v-for="(pos, i) in positions"
        :key="i"
        class="orbit-dot"
        :style="{
          width:     `${layers[i].size}px`,
          height:    `${layers[i].size}px`,
          background: layers[i].color,
          boxShadow: `0 0 10px 3px ${layers[i].shadow}`,
          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
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
