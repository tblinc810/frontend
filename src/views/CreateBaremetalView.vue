<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCloudStore } from '../stores/cloud';
import { 
  Cpu, 
  ChevronLeft, 
  Database, 
  Network, 
  Shield, 
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Activity
} from 'lucide-vue-next';

const router = useRouter();
const store = useCloudStore();

const form = ref({
  name: 'bm-node-01',
  flavorRef: '',
  imageRef: '',
  networks: [] as { uuid: string }[],
  key_name: '',
  adminPass: 'Aaaa1111',
  security_groups: [] as { name: string }[]
});

const selectedNetwork = ref('');
const selectedSecGroup = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

// Filter for baremetal flavors (usually have 'baremetal' in name or special properties)
const baremetalFlavors = computed(() => {
  return store.flavors.filter(f => 
    f.name.toLowerCase().includes('bm') || 
    f.name.toLowerCase().includes('baremetal') ||
    f.vcpus >= 8 // Heuristic for baremetal if naming is generic
  );
});

onMounted(async () => {
  if (store.flavors.length === 0) await store.fetchAll();
  
  if (baremetalFlavors.value.length > 0) form.value.flavorRef = baremetalFlavors.value[0].id;
  if (store.images.length > 0) form.value.imageRef = store.images[0].id;
  if (store.networks.length > 0) selectedNetwork.value = store.networks[0].id;
});

async function handleSubmit() {
  if (!form.value.name) {
    error.value = 'Instance name is required.';
    return;
  }
  loading.value = true;
  error.value = '';
  
  try {
    const payload = {
      name: form.value.name,
      flavorRef: form.value.flavorRef,
      imageRef: form.value.imageRef,
      networks: [{ uuid: selectedNetwork.value }],
    };
    
    if (form.value.key_name) (payload as any).key_name = form.value.key_name;
    if (form.value.adminPass) (payload as any).adminPass = form.value.adminPass;
    if (selectedSecGroup.value) (payload as any).security_groups = [{ name: selectedSecGroup.value }];

    await store.createInstance(payload);
    success.value = true;
    setTimeout(() => router.push('/instances'), 2000);
  } catch (e: any) {
    error.value = e?.response?.data?.error?.message ?? e?.message ?? 'Failed to provision bare metal.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="view-content">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-icon mr-4" @click="router.back()">
          <ChevronLeft />
        </button>
        <div>
          <h2 class="gradient-text">Provision Bare Metal</h2>
          <p class="text-muted">Direct hardware access via Ironic</p>
        </div>
      </div>
    </div>

    <div class="creation-grid">
      <div class="form-container">
        <div class="panel glass-card">
          <div class="panel-section">
            <h3 class="section-title"><Layers class="title-icon" /> Resource Identity</h3>
            <div class="row">
              <div class="field flex-1">
                <label>Host Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. bm-compute-01" class="glass-input" />
              </div>
              <div class="field flex-1">
                <label>Admin Password (Optional)</label>
                <input v-model="form.adminPass" type="password" placeholder="Set root password" class="glass-input" />
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Cpu class="title-icon" /> Architecture & Flavor</h3>
            <p v-if="baremetalFlavors.length === 0" class="text-warn mb-4">
              Note: No explicitly tagged baremetal flavors found. Showing high-performance options.
            </p>
            <div class="options-grid">
              <div 
                v-for="flv in (baremetalFlavors.length > 0 ? baremetalFlavors : store.flavors.slice(0, 4))" 
                :key="flv.id" 
                class="option-card bm-card"
                :class="{ active: form.flavorRef === flv.id }"
                @click="form.flavorRef = flv.id"
              >
                <div class="option-header">
                  <span class="option-name">{{ flv.name }}</span>
                  <Activity class="bm-indicator" />
                </div>
                <div class="option-details">
                  <span>{{ flv.vcpus }} Cores</span>
                  <span>{{ (flv.ram / 1024).toFixed(0) }} GB Physical RAM</span>
                  <span>{{ flv.disk }} GB Local Storage</span>
                  <span class="price-tag">${{ (flv.vcpus * 10 + (flv.ram / 1024) * 4).toFixed(2) }}/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Database class="title-icon" /> OS Distribution</h3>
            <select v-model="form.imageRef" class="glass-select">
              <option v-for="img in store.images" :key="img.id" :value="img.id">
                {{ img.name }}
              </option>
            </select>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Network class="title-icon" /> Physical Connectivity</h3>
            <div class="field">
              <label>Management Network</label>
              <select v-model="selectedNetwork" class="glass-select">
                <option v-for="net in store.networks" :key="net.id" :value="net.id">
                  {{ net.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-container">
        <div class="panel glass-card sticky-sidebar bm-summary">
          <div class="bm-header">
            <Layers class="w-8 h-8 mb-2" />
            <h3>Bare Metal Plan</h3>
          </div>
          
          <div class="summary-items">
            <div class="summary-item">
              <label>Physical Node</label>
              <span>{{ form.name || 'Provisioning Name' }}</span>
            </div>
            <div class="summary-item">
              <label>Configuration</label>
              <span>{{ store.flavors.find(f => f.id === form.flavorRef)?.name || 'N/A' }}</span>
            </div>
            <div class="summary-item">
              <label>Provision Type</label>
              <span class="text-primary-light">Ironic Managed</span>
            </div>
          </div>

          <div v-if="error" class="error-box">
            <AlertCircle class="w-4 h-4" />
            <span>{{ error }}</span>
          </div>

          <div v-if="success" class="success-box">
            <CheckCircle2 class="w-4 h-4" />
            <span>Bare metal provisioning started!</span>
          </div>

          <button 
            class="btn-bm-launch" 
            :disabled="loading || success" 
            @click="handleSubmit"
          >
            <Loader2 v-if="loading" class="spin mr-2" />
            {{ loading ? 'Initializing Hardware...' : 'Deploy Bare Metal' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-content { display: flex; flex-direction: column; gap: 2rem; }
.header-left { display: flex; align-items: center; }
.bm-card.active {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
}
.bm-indicator { width: 16px; height: 16px; color: #0ea5e9; opacity: 0.6; }

.creation-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.panel-section { padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
.panel-section:last-child { border-bottom: none; }

.section-title {
  display: flex; align-items: center; gap: 0.75rem;
  font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;
  color: var(--primary-light);
}

.glass-input, .glass-select {
  background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border);
  border-radius: 0.75rem; padding: 0.875rem 1.25rem; color: white; width: 100%; outline: none;
}

.options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.option-card {
  background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border);
  border-radius: 1rem; padding: 1.25rem; cursor: pointer; transition: all 0.2s;
}
.option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.option-details { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8rem; color: var(--text-muted); }
.price-tag { margin-top: 0.5rem; color: var(--primary-light); font-weight: 800; font-size: 0.9rem; }

.sticky-sidebar { position: sticky; top: 2rem; padding: 2rem; border-top: 4px solid #0ea5e9; }
.bm-header { text-align: center; margin-bottom: 2rem; color: #0ea5e9; }
.summary-items { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }
.summary-item label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
.summary-item span { font-weight: 600; }

.btn-bm-launch {
  width: 100%; background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white; border: none; border-radius: 1rem; padding: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
}

.btn-bm-launch:disabled { opacity: 0.5; cursor: not-allowed; }
.text-warn { color: #fbbf24; font-size: 0.8rem; }
.mb-4 { margin-bottom: 1rem; }
</style>
