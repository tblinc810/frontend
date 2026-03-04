<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCloudStore } from '../stores/cloud';
import {
  LucideServer, LucideArrowUp,
  LucideMessageCircle, LucideX, LucideInfo
} from 'lucide-vue-next';

// Landing Components
import LandingNav from '../components/landing/LandingNav.vue';
import LandingHero from '../components/landing/LandingHero.vue';
import LandingDevControl from '../components/landing/LandingDevControl.vue';
import LandingFeatures from '../components/landing/LandingFeatures.vue';
import LandingCalculator from '../components/landing/LandingCalculator.vue';
import LandingPricing from '../components/landing/LandingPricing.vue';
import LandingOSSupport from '../components/landing/LandingOSSupport.vue';
import LandingIntegrations from '../components/landing/LandingIntegrations.vue';
import LandingNetwork from '../components/landing/LandingNetwork.vue';
import LandingSupport from '../components/landing/LandingSupport.vue';
import LandingFAQ from '../components/landing/LandingFAQ.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';

const store = useCloudStore();

// Navigation & Activity Logic
const showNotification = ref(false);
const currentRegion = ref('US-East-1');
const regions = ['US-East-1', 'EU-West-1', 'Asia-Pacific', 'EU-North-1'];

// Floating UI state
const showChat = ref(false);
const showCookie = ref(true);
const showScrollTop = ref(false);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => {
  window.addEventListener('scroll', () => {
    showScrollTop.value = window.scrollY > 500;
  });

  // Initial activity notification
  setTimeout(() => {
    showNotification.value = true;
    setTimeout(() => { showNotification.value = false; }, 5000);
  }, 3000);

  // Periodic notification
  setInterval(() => {
    currentRegion.value = regions[Math.floor(Math.random() * regions.length)] ?? 'US-East-1';
    showNotification.value = true;
    setTimeout(() => { showNotification.value = false; }, 5000);
  }, 20000);
});
</script>

<template>
  <div :class="['landing', { 'thames-bg-light thames-light-theme': !store.isDark }]">

    <!-- 1. Navigation -->
    <LandingNav />

    <!-- 2. Hero -->
    <LandingHero />

    <!-- 3. Developer Control (Root Access) -->
    <LandingDevControl />

    <!-- 4. Enterprise Features -->
    <LandingFeatures />

    <!-- 5. Compute Calculator -->
    <LandingCalculator />

    <!-- 6. Pricing -->
    <LandingPricing />

    <!-- 7. OS Support -->
    <LandingOSSupport />

    <!-- 8. Integrations & GPU Ads -->
    <LandingIntegrations />

    <!-- 9. Network Architecture -->
    <LandingNetwork />

    <!-- 10. Support Tiers -->
    <LandingSupport />

    <!-- 11. FAQ -->
    <LandingFAQ />

    <!-- 12. Footer -->
    <LandingFooter />

    <!-- Floating Activity Notification -->
    <Transition name="slide-up">
      <div v-if="showNotification" class="activity-notification">
        <div class="notif-avatar">
          <LucideServer class="notif-icon" />
        </div>
        <div class="notif-text">
          <p><strong>Someone</strong> just deployed a VPS in</p>
          <span>{{ currentRegion }} — 2 mins ago</span>
        </div>
      </div>
    </Transition>

    <!-- Cookie Banner -->
    <Transition name="fade">
      <div v-if="showCookie" class="cookie-banner glass-card">
        <div class="c-text">
          <LucideInfo class="c-info-icon" />
          <p>We use cookies to optimize your infrastructure experience. <a href="#">Learn more</a></p>
        </div>
        <button @click="showCookie = false" class="c-close"><LucideX class="icon-s" /></button>
      </div>
    </Transition>

    <!-- Live Chat Widget -->
    <div class="chat-widget">
      <Transition name="fade">
        <div v-if="showChat" class="chat-window glass-card">
          <div class="chat-header">
            <div class="c-online-dot"></div>
            <span>Expert Support 1:1</span>
          </div>
          <div class="chat-body">
            <p>Hey there! 👋 Need help choosing the right Nova flavor or Bare Metal config?</p>
          </div>
          <div class="chat-footer">
            <input type="text" placeholder="Type a message..." />
          </div>
        </div>
      </Transition>
      <button @click="showChat = !showChat" class="chat-trigger" :class="{ active: showChat }">
        <LucideMessageCircle v-if="!showChat" class="icon" />
        <LucideX v-else class="icon" />
      </button>
    </div>

    <!-- Scroll to Top -->
    <Transition name="fade">
      <button v-if="showScrollTop" @click="scrollToTop" class="scroll-top" title="Back to Top">
        <LucideArrowUp class="scroll-icon" />
      </button>
    </Transition>

  </div>
</template>

<style>
@import '../assets/landing.css';
</style>
