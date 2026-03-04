<script setup lang="ts">
import { ref } from 'vue';
import { LucidePlus, LucideMinus, LucideHelpCircle } from 'lucide-vue-next';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

const faqs = ref<FAQ[]>([
  {
    question: "What is the difference between VPS and Bare Metal?",
    answer: "VPS (Virtual Private Server) uses virtualization to share hardware resources among multiple users, making it cost-effective for most apps. Bare Metal provides dedicated, non-virtualized hardware for maximum performance and zero overhead, ideal for high-load workloads.",
    isOpen: false
  },
  {
    question: "Do you offer automated backups?",
    answer: "Yes, our Professional and Business Elite plans come with weekly automated backups. You can also manually create snapshots of your volumes at any time from the dashboard.",
    isOpen: false
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can scale your vCPU, RAM, and Storage tiers directly from the Cloud Control Panel with minimal downtime. Our system will automatically redistribute your resources.",
    isOpen: false
  },
  {
    question: "Where are your data centers located?",
    answer: "We currently have flagship regions in US-East (New York), EU-West (London), EU-North (Stockholm), and Asia-Pacific (Singapore), with more locations coming online soon.",
    isOpen: false
  },
  {
    question: "Is there a custom SLA for enterprise clients?",
    answer: "Yes, our Business Elite plan includes a 99.99% Uptime SLA guarantee. For high-volume enterprise needs, we can provide customized contracts and dedicated account management.",
    isOpen: false
  }
]);

const toggleFAQ = (index: number) => {
  const faq = faqs.value[index];
  if (faq) {
    faq.isOpen = !faq.isOpen;
  }
};
</script>

<template>
  <section id="faq" class="faq-section">
    <div class="container narrow">
      <div class="section-header">
        <div class="badge">Common Questions</div>
        <h2>Got <span>Questions?</span></h2>
        <p>Everything you need to know about the platform and our infrastructure.</p>
      </div>

      <div class="faq-grid">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index" 
          class="faq-item" 
          :class="{ open: faq.isOpen }"
          @click="toggleFAQ(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <div class="faq-icon">
              <LucidePlus v-if="!faq.isOpen" class="icon" />
              <LucideMinus v-else class="icon" />
            </div>
          </div>
          <Transition name="expand">
            <div v-if="faq.isOpen" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="faq-footer">
        <p>Still have questions? <a href="https://cloud.tblinstance.store/support">Contact our expert team</a></p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
