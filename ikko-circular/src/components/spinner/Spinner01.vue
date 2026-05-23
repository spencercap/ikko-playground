<script setup lang="ts">

</script>

<template>
  <div class="spinner">
    <div class="spinner-inner"></div>
  </div>
</template>

<style scoped>
.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    
  width: 100%;
  aspect-ratio: 1/1;
  /* height: 100vw; */

  container-type: inline-size;

  border: 4px solid limegreen;
  border-top: 4px solid plum;
  border-radius: 50%;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner-inner {
  width: 50cqw;
  aspect-ratio: 1/1;
  border: 4px solid orangered;
  border-top: 4px solid skyblue;
  border-radius: 50%;
  animation: spin 13s linear infinite;
}
</style>