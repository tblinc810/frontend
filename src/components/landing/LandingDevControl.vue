<script setup lang="ts">
import { Key, Layers, Monitor, Settings } from 'lucide-vue-next';
</script>

<template>
  <section class="dev-control">
    <div class="container container-1440">
      <div class="section-header">
        <div class="badge">Developer First</div>
        <h2>Unrestricted <span>Root Access</span></h2>
        <p>We don't believe in limits. Get full administrative control over your OpenStack Nova compute nodes from the moment of deployment.</p>
      </div>
      <div class="dev-grid">
        <div class="dev-card glass-card">
          <Key class="dev-icon-l" />
          <h3>Full Root SSH</h3>
          <p>Complete superuser privileges. Install any package, modify any kernel parameter, and configure your OS exactly how you want it.</p>
        </div>
        <div class="dev-card glass-card">
          <Layers class="dev-icon-l" />
          <h3>OpenStack Nova Native</h3>
          <p>Industry-standard virtualization powered by OpenStack Nova. Reliable, high-performance compute instances with zero abstraction lag.</p>
        </div>
        <div class="dev-card glass-card">
          <Monitor class="dev-icon-l" />
          <h3>VNC & Serial Console</h3>
          <p>Lose your network config? No problem. Access your server directly through our out-of-band VNC and Serial consoles.</p>
        </div>
        <div class="dev-card glass-card">
          <Settings class="dev-icon-l" />
          <h3>Custom ISO Boot</h3>
          <p>Bring your own OS. Upload any ISO image and boot your instance into your preferred custom environment.</p>
        </div>
      </div>
    </div>
  </section>
</template>
