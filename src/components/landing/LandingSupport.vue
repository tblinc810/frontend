<script setup lang="ts">
import { LucideLifeBuoy, LucideHeadset, LucideShieldCheck } from 'lucide-vue-next';
</script>

<template>
  <section class="support-tiers">
    <div class="container container-1440">
      <div class="section-header">
        <div class="badge">Expert Support</div>
        <h2>We've Got Your <span>Back</span></h2>
        <p>From community forums to dedicated Slack channels, our cloud engineers are here 24/7/365.</p>
      </div>
      <div class="support-grid">
        <div class="support-card glass-card">
          <LucideLifeBuoy class="supp-icon" />
          <h4>Standard Support</h4>
          <p>Included with all accounts. Ticket-based support with a 24-hour SLA. Access to our comprehensive knowledge base.</p>
        </div>
        <div class="support-card glass-card featured-supp">
          <LucideHeadset class="supp-icon glow-icon" />
          <h4>Business Support</h4>
          <p>1-hour response times, 24/7 priority ticketing, and architectural guidance for your growing infrastructure.</p>
        </div>
        <div class="support-card glass-card">
          <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
             <LucideShieldCheck class="supp-icon" style="margin: 0;" />
             <div class="badge-new">ENTERPRISE</div>
          </div>
          <h4>Mission Critical</h4>
          <p>15-minute SLA, dedicated Technical Account Manager, and a private Slack channel with core platform engineers.</p>
        </div>
      </div>
    </div>
  </section>
</template>
