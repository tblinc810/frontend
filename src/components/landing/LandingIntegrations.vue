<script setup lang="ts">
import { ref } from 'vue';
import {
  LucideGithub, LucideTerminal, LucideCpu, LucideCloud, LucideShield, LucideCheckCircle
} from 'lucide-vue-next';

const isSubmitted = ref(false);
const email = ref('');

const handleWaitlist = () => {
  if (email.value) {
    isSubmitted.value = true;
    setTimeout(() => { isSubmitted.value = false; email.value = ''; }, 5000);
  }
};
</script>

<template>
  <div>
    <!-- Integrations Section -->
    <section class="integrations">
      <div class="container">
        <div class="integrations-scroll">
          <div class="integration-item"><LucideGithub class="i-logo" /> GitHub</div>
          <div class="integration-item"><LucideTerminal class="i-logo" /> Terraform</div>
          <div class="integration-item"><LucideCpu class="i-logo" /> NVIDIA AI</div>
          <div class="integration-item"><LucideCloud class="i-logo" /> Kubernetes</div>
          <div class="integration-item"><LucideShield class="i-logo" /> Cloudflare</div>
          <div class="integration-item"><LucideTerminal class="i-logo" /> Docker</div>
        </div>
      </div>
    </section>

    <!-- Coming Soon Section (Ads) -->
    <section class="ads">
      <div class="container">
        <div class="ad-banner">
          <div class="ad-content">
            <div class="badge-new">NEW</div>
            <h2>Coming Soon: <span>AI-Ready GPU Clusters</span></h2>
            <p>Harness the power of NVIDIA A100/H100 instances for your LLM and machine learning workloads. Join the waitlist for early access.</p>
            
            <form v-if="!isSubmitted" class="waitlist-form" @submit.prevent="handleWaitlist">
              <input v-model="email" type="email" placeholder="Enter your email address" required />
              <button type="submit" class="btn-primary">Join Waitlist</button>
            </form>
            <div v-else class="waitlist-success">
              <LucideCheckCircle class="success-icon" />
              <span>You're on the list! We'll reach out soon.</span>
            </div>

            <div class="ad-features">
              <span><LucideCheckCircle class="mini-check" /> Global CDN</span>
              <span><LucideCheckCircle class="mini-check" /> Kubernetes as a Service <div class="badge-tiny">NEW</div></span>
              <span><LucideCheckCircle class="mini-check" /> Database Fleet</span>
            </div>
          </div>
          <div class="ad-visual">
            <div class="glow-box"></div>
            <LucideCpu class="floating-icon" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
