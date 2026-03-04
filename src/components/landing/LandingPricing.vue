<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle } from 'lucide-vue-next';

const isAnnual = ref(false);
</script>

<template>
  <section id="pricing" class="pricing">
    <div class="container">
      <div class="section-header">
        <div class="badge">Transparent Pricing</div>
        <h2>Enterprise Power, <span>Personal Price</span></h2>
        <p>Choose the perfect plan for your project. Save 20% with annual billing.</p>
        
        <div class="pricing-toggle">
          <span :class="{ active: !isAnnual }">Monthly</span>
          <button class="toggle-switch" @click="isAnnual = !isAnnual" :class="{ annual: isAnnual }">
            <span class="switch-dot"></span>
          </button>
          <span :class="{ active: isAnnual }">Annual <em>-20%</em></span>
        </div>
      </div>
      <div class="pricing-grid">
        <div class="price-card">
          <div class="card-header">
            <h3>Cloud Starter</h3>
            <p class="subtitle">Personal powerhouse for devs & side projects.</p>
            <div class="price">${{ isAnnual ? '4' : '5' }}<span>/mo</span></div>
          </div>
          <ul class="specs">
            <li><CheckCircle class="check" /> 2 vCPU Cores (Intel Xeon)</li>
            <li><CheckCircle class="check" /> 4 GB DDR4 RAM</li>
            <li><CheckCircle class="check" /> 60 GB NVMe Gen4 Storage</li>
            <li><CheckCircle class="check" /> 2 TB Premium Bandwidth</li>
            <li><CheckCircle class="check" /> Basic DDoS Protection</li>
          </ul>
          <a href="https://cloud.tblinstance.store/instances/create?flavor=starter" class="btn-outline">Start Building</a>
        </div>
        
        <div class="price-card featured">
          <div class="featured-badge">Most Popular</div>
          <div class="card-header">
            <h3>Professional</h3>
            <p class="subtitle">Enterprise performance for production apps.</p>
            <div class="price">${{ isAnnual ? '12' : '15' }}<span>/mo</span></div>
          </div>
          <ul class="specs">
            <li><CheckCircle class="check" /> 6 vCPU Cores (AMD EPYC)</li>
            <li><CheckCircle class="check" /> 16 GB DDR4 RAM</li>
            <li><CheckCircle class="check" /> 240 GB NVMe Gen4 Storage</li>
            <li><CheckCircle class="check" /> 8 TB Premium Bandwidth</li>
            <li><CheckCircle class="check" /> Weekly Automated Backups</li>
            <li><CheckCircle class="check" /> Global Anycast IP Support</li>
          </ul>
          <a href="https://cloud.tblinstance.store/instances/create?flavor=pro" class="btn-primary">Scale Up Now</a>
        </div>
        
        <div class="price-card">
          <div class="card-header">
            <h3>Business Elite</h3>
            <p class="subtitle">Dedicated resources for mission-critical loads.</p>
            <div class="price">${{ isAnnual ? '36' : '45' }}<span>/mo</span></div>
          </div>
          <ul class="specs">
            <li><CheckCircle class="check" /> 12 vCPU Cores (High-Freq)</li>
            <li><CheckCircle class="check" /> 64 GB DDR4 RAM</li>
            <li><CheckCircle class="check" /> 1 TB NVMe RAID-10 Storage</li>
            <li><CheckCircle class="check" /> Unlimited Bandwidth</li>
            <li><CheckCircle class="check" /> 99.99% Uptime SLA Guarantee</li>
            <li><CheckCircle class="check" /> 24/7 On-Call Priority Support</li>
          </ul>
          <a href="https://cloud.tblinstance.store/instances/create?flavor=elite" class="btn-outline">Go Enterprise</a>
        </div>
      </div>
    </div>
  </section>
</template>
