<script setup lang="ts">
import { LucideGlobe, LucideShieldCheck, LucideNetwork, LucideServer, LucideCheckCircle } from 'lucide-vue-next';
</script>

<template>
  <section class="network-arch">
    <div class="container container-1440">
      <div class="grid-2 align-center">
        <div class="net-content">
          <div class="badge">Advanced Networking</div>
          <h2>100Gbps <span>Redundant Backbone</span></h2>
          <p>Our network is engineered for extreme throughput and maximum reliability. Built on dark fiber and powered by advanced BGP Anycast routing.</p>
          <ul class="check-list dark-list">
            <li><LucideCheckCircle class="mini-check" /> <strong>Native IPv6 Support:</strong> Every instance ready for the future.</li>
            <li><LucideCheckCircle class="mini-check" /> <strong>L3/L4 DDoS Mitigation:</strong> 2Tbps of inline filtering included.</li>
            <li><LucideCheckCircle class="mini-check" /> <strong>BGP Anycast:</strong> Traffic routing through the absolute shortest path.</li>
            <li><LucideCheckCircle class="mini-check" /> <strong>Private VPCs:</strong> Secure, isolated Layer 2 networks.</li>
          </ul>
        </div>
        <div class="net-visual glass-card">
          <div class="nv-top">
            <div class="n-node"><LucideGlobe class="node-icon"/><span>Public Web</span></div>
          </div>
          <div class="n-path-block">
            <div class="n-path animate-flow"></div>
            <div class="n-ddos"><LucideShieldCheck class="node-icon"/><span>DDoS Mitigation Layer</span></div>
            <div class="n-path animate-flow delay-1"></div>
          </div>
          <div class="nv-bottom">
            <div class="n-node core-node"><LucideNetwork class="node-icon"/><span>Core Switch</span></div>
            <div class="n-node core-node"><LucideServer class="node-icon"/><span>Hypervisor</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
