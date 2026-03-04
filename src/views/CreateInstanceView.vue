<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCloudStore } from '../stores/cloud';
import { 
  Server, 
  ChevronLeft, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-vue-next';
import ProjectSelector from '../components/dashboard/ProjectSelector.vue';

const router = useRouter();
const store = useCloudStore();

const form = ref({
  name: 'cloud-vm-01',
  flavorRef: '',
  imageRef: '',
  networks: [] as { uuid: string }[],
  key_name: '',
  adminPass: 'Aaaa1111',
  security_groups: [] as { name: string }[]
});

const selectedNetwork = ref('');
const selectedSecGroup = ref('');
const newKeyName = ref('');
const showKeyModal = ref(false);
const loading = ref(false);
const generatingKey = ref(false);
const error = ref('');
const success = ref(false);

onMounted(async () => {
  if (store.flavors.length === 0) await store.fetchAll();
  
  // Set defaults if data is available
  if (store.flavors.length > 0) form.value.flavorRef = store.flavors[0].id;
  if (store.images.length > 0) form.value.imageRef = store.images[0].id;
  if (store.networks.length > 0) {
    const net = store.networks.find(n => !n['router:external']) || store.networks[0];
    selectedNetwork.value = net.id;
  }
});

async function handleGenerateKey() {
  if (!newKeyName.value) return;
  generatingKey.value = true;
  try {
    const kp = await store.createKeypair(newKeyName.value);
    if (kp && kp.private_key) {
      // Download Private Key
      const blob = new Blob([kp.private_key], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${newKeyName.value}.pem`;
      a.click();
      
      form.value.key_name = newKeyName.value;
      showKeyModal.value = false;
      newKeyName.value = '';
    }
  } catch (e: any) {
    error.value = 'Key generation failed. Key name might be taken.';
  } finally {
    generatingKey.value = false;
  }
}

async function handleSubmit() {
  if (!form.value.name) {
    error.value = 'Instance name is required.';
    return;
  }
  if (!selectedNetwork.value) {
    error.value = 'Please select a network.';
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    const payload: any = {
      name: form.value.name,
      flavorRef: form.value.flavorRef,
      imageRef: form.value.imageRef,
      networks: [{ uuid: selectedNetwork.value }],
    };
    
    if (form.value.key_name) payload.key_name = form.value.key_name;
    if (form.value.adminPass) payload.adminPass = form.value.adminPass;
    if (selectedSecGroup.value) payload.security_groups = [{ name: selectedSecGroup.value }];

    await store.createInstance(payload);
    success.value = true;
    setTimeout(() => {
      router.push('/instances');
    }, 2000);
  } catch (e: any) {
    error.value = e?.response?.data?.error?.message ?? e?.message ?? 'Failed to create instance.';
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
          <h2 class="gradient-text">Launch New Instance</h2>
          <p class="text-muted">Provisioning in Region: <strong>RegionOne</strong></p>
        </div>
        <ProjectSelector class="ml-6" />
      </div>
    </div>

    <div class="creation-grid">
      <div class="form-container">
        <div class="panel glass-card">
          <div class="panel-section">
            <h3 class="section-title"><Server class="title-icon" /> Identity & Access</h3>
            <div class="row">
              <div class="field flex-1">
                <label>Instance Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. cloud-vm-01" class="glass-input" />
              </div>
              <div class="field flex-1">
                <label>Admin Password (Optional)</label>
                <input v-model="form.adminPass" type="password" placeholder="Set root password" class="glass-input" />
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Key class="title-icon" /> SSH Key Pair</h3>
            <div class="row items-end">
              <div class="field flex-1">
                <label>Select Key Pair</label>
                <select v-model="form.key_name" class="glass-select">
                  <option value="">No Key (Password Auth Only)</option>
                  <option v-for="kp in store.keypairs" :key="kp.keypair.name" :value="kp.keypair.name">
                    {{ kp.keypair.name }}
                  </option>
                </select>
              </div>
              <button class="btn-secondary h-[48px]" @click="showKeyModal = true">
                <Key class="icon mr-2" /> Generate New Key
              </button>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Cpu class="title-icon" /> Flavor Selection</h3>
            <div class="options-grid">
              <div 
                v-for="flv in store.flavors" 
                :key="flv.id" 
                class="option-card"
                :class="{ active: form.flavorRef === flv.id }"
                @click="form.flavorRef = flv.id"
              >
                <div class="option-header">
                  <span class="option-name">{{ flv.name }}</span>
                  <div class="radio-circle"></div>
                </div>
                <div class="option-details">
                  <span>{{ flv.vcpus }} vCPU / {{ (flv.ram / 1024).toFixed(1) }} GB RAM</span>
                  <span class="price-tag">${{ (flv.vcpus * 5 + (flv.ram / 1024) * 2).toFixed(2) }}/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Database class="title-icon" /> Source OS Image</h3>
            <select v-model="form.imageRef" class="glass-select">
              <option v-for="img in store.images" :key="img.id" :value="img.id">
                {{ img.name }}
              </option>
            </select>
          </div>

          <div class="panel-section">
            <h3 class="section-title"><Network class="title-icon" /> Network & Security</h3>
            <div class="row">
              <div class="field flex-1">
                <label>Target Network</label>
                <select v-model="selectedNetwork" class="glass-select">
                  <option v-for="net in store.networks" :key="net.id" :value="net.id">
                    {{ net.name }}
                  </option>
                </select>
              </div>
              <div class="field flex-1">
                <label>Security Group</label>
                <select v-model="selectedSecGroup" class="glass-select">
                  <option value="">default</option>
                  <option v-for="sg in store.securityGroups" :key="sg.id" :value="sg.name">
                    {{ sg.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Modal -->
      <div v-if="showKeyModal" class="modal-overlay">
        <div class="modal-content glass-card">
          <h3>Generate SSH Key Pair</h3>
          <p class="text-muted mb-4">A private key (.pem) will be downloaded to your computer. Keep it safe!</p>
          <div class="field mb-6">
            <label>Key Name</label>
            <input v-model="newKeyName" type="text" placeholder="e.g. my-cloud-key" class="glass-input" />
          </div>
          <div class="modal-actions">
            <button class="btn-text" @click="showKeyModal = false">Cancel</button>
            <button class="btn-primary" :disabled="!newKeyName || generatingKey" @click="handleGenerateKey">
              <Loader2 v-if="generatingKey" class="spin mr-2" />
              Download & Use Key
            </button>
          </div>
        </div>
      </div>

      <div class="summary-container">
        <div class="panel glass-card sticky-sidebar">
          <h3>Launch Summary</h3>
          <div class="summary-items">
            <div class="summary-item">
              <label>Instance Name</label>
              <span>{{ form.name || '—' }}</span>
            </div>
            <div class="summary-item">
              <label>Image</label>
              <span>{{ store.images.find(i => i.id === form.imageRef)?.name || '—' }}</span>
            </div>
            <div class="summary-item">
              <label>Flavor</label>
              <span>{{ store.flavors.find(f => f.id === form.flavorRef)?.name || '—' }}</span>
            </div>
            <div class="summary-item">
              <label>Network</label>
              <span>{{ store.networks.find(n => n.id === selectedNetwork)?.name || '—' }}</span>
            </div>
          </div>

          <div v-if="error" class="error-box">
            <AlertCircle class="w-4 h-4" />
            <span>{{ error }}</span>
          </div>

          <div v-if="success" class="success-box">
            <CheckCircle2 class="w-4 h-4" />
            <span>Instance launch initiated successfully!</span>
          </div>

          <button 
            class="btn-launch" 
            :disabled="loading || success" 
            @click="handleSubmit"
          >
            <Loader2 v-if="loading" class="spin mr-2" />
            {{ loading ? 'Launching...' : 'Provision Instance' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-content { display: flex; flex-direction: column; gap: 2rem; }
.header-left { display: flex; align-items: center; }
.mr-4 { margin-right: 1rem; }
.mr-2 { margin-right: 0.5rem; }

.creation-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.panel-section { padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
.panel-section:last-child { border-bottom: none; }

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary-light);
}

.title-icon { width: 20px; height: 20px; }
.inline-icon { width: 14px; height: 14px; margin-right: 4px; vertical-align: middle; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }

.glass-input, .glass-select {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: white;
  width: 100%;
  outline: none;
}

.glass-input:focus, .glass-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.option-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover { border-color: var(--primary); }
.option-card.active {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.option-name { font-weight: 700; }
.radio-circle {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 50%;
  position: relative;
}
.active .radio-circle { border-color: var(--primary); }
.active .radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
}

.option-details { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8rem; color: var(--text-muted); }
.price-tag { margin-top: 0.5rem; color: var(--primary-light); font-weight: 800; font-size: 0.9rem; }

.row { display: flex; gap: 1.5rem; }
.flex-1 { flex: 1; }

.sticky-sidebar { position: sticky; top: 2rem; padding: 2rem; }
.summary-items { display: flex; flex-direction: column; gap: 1.25rem; margin: 1.5rem 0 2rem; }
.summary-item { display: flex; flex-direction: column; gap: 0.25rem; }
.summary-item label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
.summary-item span { font-weight: 600; font-family: 'Outfit', sans-serif; }

.btn-launch {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), #4f46e5);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.btn-launch:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  border: 1px solid var(--border);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: white;
  padding: 0 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-muted);
  font-weight: 600;
  padding: 0.75rem 1rem;
}

.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.items-end { align-items: flex-end; }
.h-\[48px\] { height: 48px; }

.btn-icon {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
