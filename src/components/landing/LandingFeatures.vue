<script setup lang="ts">
import { LucideCpu, LucideShield, LucideServer } from 'lucide-vue-next';
</script>

<template>
  <section id="vps" class="features">
    <div class="container">
      <div class="section-header">
        <h2>Enterprise-Grade Features</h2>
        <p>Everything you need to scale your business without the complexity.</p>
      </div>
      <div class="feature-grid">
        <div class="feature-card">
          <LucideCpu class="card-icon" />
          <h3>High Performance</h3>
          <p>AMD EPYC™ processors and NVMe storage for maximum throughput and minimal latency.</p>
        </div>
        <div class="feature-card">
          <LucideShield class="card-icon" />
          <h3>Secure by Design</h3>
          <p>Native IPv4/IPv6 support, private networks, and built-in DDoS protection for every instance.</p>
        </div>
        <div class="feature-card">
          <LucideServer class="card-icon" />
          <h3>Bare Metal</h3>
          <p>Direct hardware access for compute-intensive workloads that require zero overhead.</p>
        </div>
      </div>
    </div>
  </section>
</template>
