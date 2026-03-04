<script setup lang="ts">
import { LucideCloud, LucideGithub, LucideTwitter, LucideLinkedin } from 'lucide-vue-next';
</script>

<template>
  <footer>
    <div class="container footer-grid">
      <div class="footer-col-brand">
        <div class="footer-brand">
          <LucideCloud class="logo-icon" />
          <span>TBL Cloud</span>
        </div>
        <p>Enterprise infrastructure for the modern age. Scalable, reliable, and secure OpenStack solutions.</p>
        <div class="footer-socials">
          <a href="#" class="fs-link"><LucideGithub class="fs-icon" /></a>
          <a href="#" class="fs-link"><LucideTwitter class="fs-icon" /></a>
          <a href="#" class="fs-link"><LucideLinkedin class="fs-icon" /></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Product</h4>
        <div class="footer-links">
          <a href="#vps">Cloud Compute</a>
          <a href="#">Bare Metal</a>
          <a href="#regions">Global Regions</a>
          <a href="#pricing">Pricing Plans</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <div class="footer-links">
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
          <a href="#">Status Monitor</a>
          <a href="#">Security Hub</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <div class="footer-links">
          <a href="#">About TBL</a>
          <a href="#">Contact Support</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 TBL Cloud. Engineering the future of infrastructure.</p>
      </div>
    </div>
  </footer>
</template>
