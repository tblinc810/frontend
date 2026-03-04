<script setup lang="ts">
import { ref } from 'vue';

const calcCores = ref(2);
const calcRam = ref(4);
const calcDisk = ref(80);

const calcPrice = () => {
  return (calcCores.value * 2) + (calcRam.value * 1) + (calcDisk.value * 0.05);
};
</script>

<template>
  <section class="calculator">
    <div class="container calc-container">
      <div class="calc-wrapper glass-card">
        <div class="calc-controls">
          <h2>Estimate Your <span>Costs</span></h2>
          <div class="range-group">
            <label>CPU Cores: <span>{{ calcCores }} vCPU</span></label>
            <input type="range" v-model.number="calcCores" min="1" max="32" step="1" />
          </div>
          <div class="range-group">
            <label>Memory: <span>{{ calcRam }} GB RAM</span></label>
            <input type="range" v-model.number="calcRam" min="1" max="128" step="1" />
          </div>
          <div class="range-group">
            <label>Storage: <span>{{ calcDisk }} GB NVMe</span></label>
            <input type="range" v-model.number="calcDisk" min="20" max="2000" step="20" />
          </div>
        </div>
        <div class="calc-result">
          <div class="price-estimate">
            <span class="p-label">Estimated Monthly</span>
            <span class="p-value">${{ calcPrice().toFixed(2) }}</span>
          </div>
          <p>Billed hourly, only pay for what you use.</p>
          <a href="https://cloud.tblinstance.store/instances/create" class="btn-primary full-w">Launch This Config</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Force the calc container to be block, not the inherited grid from .hero .container */
.calc-container {
  display: block !important;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.calc-wrapper {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .calc-container {
    padding: 0 1rem;
  }
}
</style>
