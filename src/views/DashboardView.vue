<script setup lang="ts">
import { computed } from 'vue';
import { useCloudStore } from '../stores/cloud';
import { Server, Database, Network, Image, Activity, RefreshCcw, ShieldCheck, Cloud, Layers } from 'lucide-vue-next';
import ProjectSelector from '../components/dashboard/ProjectSelector.vue';

const store = useCloudStore();

const stats = computed(() => [
  { label: 'Instances', value: store.instances.length, icon: Server, color: '#818cf8', sub: `${store.instances.filter(i => i.status === 'ACTIVE').length} active` },
  { label: 'Projected Cost', value: `$${totalMonthlyCost.value}`, icon: Activity, color: '#facc15', sub: 'Est. per month' },
  { label: 'Volumes', value: `${store.totalVolumeGB} GB`, icon: Database, color: '#fb7185', sub: `${store.volumes.length} total` },
  { label: 'Networks', value: store.networks.length,  icon: Network, color: '#34d399', sub: `${store.subnets.length} subnets` },
]);

const recentInstances = computed(() => store.instances.slice(0, 5));
const activeInstances = computed(() => store.instances.filter(i => i.status === 'ACTIVE').length);
const totalMonthlyCost = computed(() => {
  return store.instances.reduce((acc, inst) => {
    if (!inst.flavor) return acc;
    return acc + (inst.flavor.vcpus * 5 + (inst.flavor.ram / 1024) * 2);
  }, 0).toFixed(2);
});
const cpuPercent = computed(() => Math.min(100, (activeInstances.value / Math.max(1, store.instances.length)) * 100).toFixed(0));
</script>

<template>
  <div class="view-content">
    <!-- Page header -->
    <div class="page-header">
      <div class="header-left">
        <div>
          <h2>Dashboard</h2>
          <p class="text-muted">Region: <strong>RegionOne</strong> · {{ new Date().toLocaleDateString() }}</p>
        </div>
        <ProjectSelector class="ml-6" />
      </div>
      <button class="btn-refresh" @click="store.fetchAll()" :disabled="store.isLoading">
        <RefreshCcw :class="['icon', { spin: store.isLoading }]" />
        Refresh
      </button>
    </div>

    <!-- Error banner -->
    <div v-if="store.error" class="error-banner glass-card">
      {{ store.error }}
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card glass-card">
        <div class="stat-icon" :style="{ background: s.color + '20', color: s.color }">
          <component :is="s.icon" />
        </div>
        <div class="stat-body">
          <p class="stat-val">{{ s.value }}</p>
          <p class="stat-label">{{ s.label }}</p>
          <p class="stat-sub">{{ s.sub }}</p>
        </div>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="two-col">
      <!-- Recent Instances -->
      <div class="panels-column">
        <div class="panel glass-card">
          <div class="panel-header">
            <h3>Recent Instances</h3>
            <span class="badge">{{ store.instances.length }} total</span>
          </div>
          <div v-if="recentInstances.length === 0" class="empty">No instances found.</div>
          <table v-else class="data-table">
            <thead><tr>
              <th>Name</th><th>Status</th><th>IPs</th><th>Created</th>
            </tr></thead>
            <tbody>
              <tr v-for="i in recentInstances" :key="i.id">
                <td class="name-cell"><Server class="icon-sm text-primary" />{{ i.name }}</td>
                <td><span :class="['badge-pill', i.status.toLowerCase()]">{{ i.status }}</span></td>
                <td class="mono">{{ Object.values(i.addresses || {}).flat().map((a: any) => a.addr).join(', ') || '—' }}</td>
                <td class="mono text-muted">{{ new Date(i.created).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="panel glass-card mt-6">
          <div class="panel-header">
            <h3>Bare Metal Infrastructure</h3>
            <span class="badge">{{ store.baremetalNodes.length }} nodes</span>
          </div>
          <div v-if="store.baremetalNodes.length === 0" class="empty">No baremetal nodes connected.</div>
          <table v-else class="data-table">
            <thead><tr>
              <th>UUID / Name</th><th>Provision State</th><th>Power</th><th>Maintenance</th>
            </tr></thead>
            <tbody>
              <tr v-for="node in store.baremetalNodes.slice(0, 5)" :key="node.uuid">
                <td class="name-cell"><Layers class="icon-sm text-info" />{{ node.name || node.uuid.slice(0,8) }}</td>
                <td><span :class="['badge-pill', node.provision_state === 'active' ? 'active' : 'warn']">{{ node.provision_state }}</span></td>
                <td><span class="mono">{{ node.power_state ?? '—' }}</span></td>
                <td><span :class="['status-dot-sm', node.maintenance ? 'error' : 'success']"></span> {{ node.maintenance ? 'Yes' : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Health panel -->
      <div class="panel glass-card side-panel">
        <h3>System Health</h3>

        <div class="meter-group">
          <div class="meter">
            <div class="meter-label"><span>Active Instances</span><span>{{ cpuPercent }}%</span></div>
            <div class="meter-track"><div class="meter-fill indigo" :style="{ width: cpuPercent + '%' }"></div></div>
          </div>
          <div class="meter">
            <div class="meter-label"><span>Volume Usage</span><span>{{ store.totalVolumeGB }} GB</span></div>
            <div class="meter-track"><div class="meter-fill rose" style="width: 60%"></div></div>
          </div>
          <div class="meter">
            <div class="meter-label"><span>Network Links</span><span>{{ store.networks.length }}</span></div>
            <div class="meter-track"><div class="meter-fill emerald" :style="{ width: Math.min(100, store.networks.length * 10) + '%' }"></div></div>
          </div>
        </div>

        <div class="status-orb">
          <div class="orb-ring"></div>
          <ShieldCheck class="orb-icon" />
        </div>
        <p class="orb-label">All Systems Operational</p>
        <p class="text-muted text-xs">Cloudflare Tunnel Active</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-content { display: flex; flex-direction: column; gap: 2rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.page-header h2 { font-size: 1.75rem; font-weight: 800; }
.btn-refresh {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
  color: var(--primary); border-radius: 0.875rem; padding: 0.625rem 1.25rem;
  font-weight: 600;
}
.btn-refresh:disabled { opacity: 0.5; transform: none; cursor: default; }
.icon { width: 16px; height: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-banner {
  padding: 1rem 1.5rem;
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.3);
  color: #fb7185;
}

.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
}

.stat-card {
  display: flex; gap: 1.25rem; align-items: center; padding: 1.5rem;
  transition: all 0.3s;
}
.stat-card:hover { transform: translateY(-2px); border-color: var(--primary); }

.stat-icon {
  width: 54px; height: 54px; border-radius: 1rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon > * { width: 26px; height: 26px; }

.stat-val { font-size: 1.5rem; font-weight: 800; }
.stat-label { font-size: 0.875rem; color: var(--text-muted); }
.stat-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

.two-col {
  display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;
}

.panel { padding: 1.75rem; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.panel-header h3 { font-size: 1.1rem; font-weight: 700; }
.badge {
  background: rgba(99,102,241,0.1); color: var(--primary);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 2rem; padding: 0.125rem 0.75rem; font-size: 0.75rem; font-weight: 700;
}
.empty { color: var(--text-muted); text-align: center; padding: 3rem; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left; font-size: 0.7rem; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text-muted); padding-bottom: 1rem;
}
.data-table td { padding: 0.875rem 0; border-top: 1px solid var(--border); font-size: 0.875rem; }
.name-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
.icon-sm { width: 16px; height: 16px; flex-shrink: 0; }
.text-primary { color: var(--primary); }

.badge-pill {
  padding: 0.2rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
}
.badge-pill.active { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.shutoff, .badge-pill.stopped { background: rgba(148,163,184,0.1); color: #94a3b8; }
.badge-pill.error { background: rgba(244,63,94,0.1); color: #fb7185; }
.badge-pill.build { background: rgba(251,191,36,0.1); color: #fbbf24; }

.mono { font-family: monospace; font-size: 0.8rem; }
.text-xs { font-size: 0.75rem; }

.side-panel { display: flex; flex-direction: column; }
.side-panel h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.75rem; }

.panels-column { display: flex; flex-direction: column; gap: 1.5rem; }
.mt-6 { margin-top: 1.5rem; }
.text-info { color: #0ea5e9; }

.status-dot-sm {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 4px;
}
.status-dot-sm.success { background: #34d399; }
.status-dot-sm.error { background: #fb7185; }

.meter-group { display: flex; flex-direction: column; gap: 1.25rem; }
.meter-label { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.5rem; }
.meter-track { height: 8px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; }
.meter-fill { height: 100%; border-radius: 8px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.meter-fill.indigo { background: linear-gradient(90deg, var(--primary), #818cf8); }
.meter-fill.rose { background: linear-gradient(90deg, #e11d48, #fb7185); }
.meter-fill.emerald { background: linear-gradient(90deg, #059669, #34d399); }

.status-orb {
  position: relative; width: 88px; height: 88px;
  background: rgba(99,102,241,0.08); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 2rem auto 1rem;
}
.orb-ring {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--primary); opacity: 0.12;
  animation: pulse 2s ease-in-out infinite;
}
.orb-icon { width: 38px; height: 38px; color: var(--primary); }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.12; } 50% { transform: scale(1.3); opacity: 0; } }
.orb-label { text-align: center; font-weight: 700; font-size: 0.875rem; }
</style>
