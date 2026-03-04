<script setup lang="ts">
import { Cloud, ChevronDown, Sun, Moon, ChevronRight } from 'lucide-vue-next';

// You would typically pass customerLogos as a prop or import it from a constant file
const customerLogos = [
  { name: 'Nexus Tech', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'QuantX', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
  { name: 'Vortex Cloud', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Figma-logo.svg' },
  { name: 'SkyNet', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Zendesk_logo.svg' },
  { name: 'Aether', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Lumina', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg' }
];

</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-content">
          <div class="badge">Next Generation Cloud</div>
          <h1>Deploy your <span>Dream Infrastructure</span> in seconds.</h1>
          <p>
            Experience lightning-fast VPS and enterprise Bare Metal servers across the globe. 
            Automated provisioning, reliable block storage, and powerful networking for the modern era.
          </p>
          <div class="cta-group">
            <a href="https://cloud.tblinstance.store/instances/create" class="btn-primary">
              Get Started <ChevronRight class="icon" />
            </a>
            <a href="https://cloud.tblinstance.store" class="btn-secondary">
              View Dashboard
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="terminal-mockup">
            <div class="terminal-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="title">tbl-cloud-cli</span>
            </div>
            <div class="terminal-body">
              <div class="line"><span class="prompt">$</span> tbl instance create --flavor cloud-v1 --image ubuntu-24.04</div>
              <div class="line success">Processing request...</div>
              <div class="line">Instance: <span class="highlight">cloud-vm-01</span> created successfully.</div>
              <div class="line">IP Address: <span class="highlight">104.28.14.92</span></div>
              <div class="line"><span class="prompt">$</span> _</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted By Section (Logos) -->
    <section class="trusted-by">
      <div class="container">
        <span class="trust-label">Powering innovative companies worldwide</span>
        <div class="logo-marquee">
          <div class="marquee-content">
            <img v-for="(logo, i) in [...customerLogos, ...customerLogos]" :key="i" :src="logo.logo" :alt="logo.name" class="client-logo" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
