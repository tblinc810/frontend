<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCloudStore } from '../stores/cloud';
import { Network, GitBranch, Router, Wifi, RefreshCcw } from 'lucide-vue-next';

const store = useCloudStore();
const tab = ref<'networks' | 'subnets' | 'routers' | 'floating'>('networks');
</script>

<template>
  <div class="view-content">
    <div class="page-header">
      <div>
        <h2>Network</h2>
        <p class="text-muted">{{ store.networks.length }} networks · {{ store.subnets.length }} subnets · {{ store.routers.length }} routers</p>
      </div>
      <button class="btn-primary" @click="store.fetchAll()">
        <RefreshCcw :class="['icon', { spin: store.isLoading }]" /> Refresh
      </button>
    </div>

    <!-- Tabs -->
    <div class="tab-bar glass-card">
      <button :class="['tab', { active: tab === 'networks' }]" @click="tab = 'networks'">
        <Network class="icon" /> Networks
      </button>
      <button :class="['tab', { active: tab === 'subnets' }]" @click="tab = 'subnets'">
        <GitBranch class="icon" /> Subnets
      </button>
      <button :class="['tab', { active: tab === 'routers' }]" @click="tab = 'routers'">
        <Router class="icon" /> Routers
      </button>
      <button :class="['tab', { active: tab === 'floating' }]" @click="tab = 'floating'">
        <Wifi class="icon" /> Floating IPs
      </button>
    </div>

    <!-- Networks -->
    <div v-if="tab === 'networks'" class="panel glass-card">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Type</th><th>Shared</th><th>Subnets</th><th>ID</th></tr></thead>
        <tbody>
          <tr v-for="n in store.networks" :key="n.id">
            <td class="fw-bold">{{ n.name || '(unnamed)' }}</td>
            <td><span :class="['badge-pill', n.status?.toLowerCase()]">{{ n.status }}</span></td>
            <td class="text-muted">{{ n['provider:network_type'] ?? '—' }}</td>
            <td><span :class="['badge-pill', n.shared ? 'success' : 'muted']">{{ n.shared ? 'Yes' : 'No' }}</span></td>
            <td class="mono text-muted">{{ n.subnets?.length ?? 0 }}</td>
            <td class="mono text-muted">{{ n.id.slice(0, 12) }}…</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!store.networks.length" class="empty">No networks found.</div>
    </div>

    <!-- Subnets -->
    <div v-if="tab === 'subnets'" class="panel glass-card">
      <table class="data-table">
        <thead><tr><th>Name</th><th>CIDR</th><th>IP Version</th><th>Gateway</th><th>DHCP</th><th>Network</th></tr></thead>
        <tbody>
          <tr v-for="s in store.subnets" :key="s.id">
            <td class="fw-bold">{{ s.name || '(unnamed)' }}</td>
            <td class="mono">{{ s.cidr }}</td>
            <td class="text-muted">IPv{{ s.ip_version }}</td>
            <td class="mono text-muted">{{ s.gateway_ip ?? '—' }}</td>
            <td><span :class="['badge-pill', s.enable_dhcp ? 'success' : 'muted']">{{ s.enable_dhcp ? 'Yes' : 'No' }}</span></td>
            <td class="mono text-muted">{{ s.network_id.slice(0, 12) }}…</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!store.subnets.length" class="empty">No subnets found.</div>
    </div>

    <!-- Routers -->
    <div v-if="tab === 'routers'" class="panel glass-card">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Admin State</th><th>External GW</th><th>Distributed</th></tr></thead>
        <tbody>
          <tr v-for="r in store.routers" :key="r.id">
            <td class="fw-bold">{{ r.name }}</td>
            <td><span :class="['badge-pill', r.status?.toLowerCase()]">{{ r.status }}</span></td>
            <td><span :class="['badge-pill', r.admin_state_up ? 'success' : 'error']">{{ r.admin_state_up ? 'Up' : 'Down' }}</span></td>
            <td class="mono text-muted">{{ r.external_gateway_info?.network_id?.slice(0, 12) ?? '—' }}</td>
            <td><span :class="['badge-pill', r.distributed ? 'success' : 'muted']">{{ r.distributed ? 'Yes' : 'No' }}</span></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!store.routers.length" class="empty">No routers found.</div>
    </div>

    <!-- Floating IPs -->
    <div v-if="tab === 'floating'" class="panel glass-card">
      <table class="data-table">
        <thead><tr><th>Floating IP</th><th>Status</th><th>Fixed IP</th><th>Instance</th><th>Network</th></tr></thead>
        <tbody>
          <tr v-for="f in store.floatingIPs" :key="f.id">
            <td class="mono fw-bold">{{ f.floating_ip_address }}</td>
            <td><span :class="['badge-pill', f.status?.toLowerCase()]">{{ f.status }}</span></td>
            <td class="mono text-muted">{{ f.fixed_ip_address ?? '—' }}</td>
            <td class="mono text-muted">{{ f.port_id?.slice(0, 12) ?? 'Unassociated' }}</td>
            <td class="mono text-muted">{{ f.floating_network_id?.slice(0, 12) }}…</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!store.floatingIPs.length" class="empty">No floating IPs found.</div>
    </div>
  </div>
</template>

<style scoped>
.view-content { display: flex; flex-direction: column; gap: 2rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.page-header h2 { font-size: 1.75rem; font-weight: 800; }
.btn-primary { display: flex; align-items: center; gap: 0.5rem; background: var(--primary); color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 0.875rem; font-weight: 700; }
.icon { width: 16px; height: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.tab-bar { display: flex; padding: 0.5rem; gap: 0.25rem; border-radius: 1rem; }
.tab {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.625rem 1.25rem; border-radius: 0.75rem; border: none;
  color: var(--text-muted); font-weight: 600; font-size: 0.875rem; transition: all 0.2s;
}
.tab:hover { background: rgba(255,255,255,0.05); color: white; }
.tab.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.35); }

.panel { padding: 1.75rem; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding-bottom: 1.25rem; }
.data-table td { padding: 1rem 0; border-top: 1px solid var(--border); font-size: 0.875rem; }
.fw-bold { font-weight: 600; }
.mono { font-family: monospace; font-size: 0.8rem; }
.empty { text-align: center; padding: 3rem; color: var(--text-muted); }

.badge-pill { padding: 0.2rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.badge-pill.active { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.build { background: rgba(251,191,36,0.1); color: #fbbf24; }
.badge-pill.error { background: rgba(244,63,94,0.1); color: #fb7185; }
.badge-pill.success { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.muted { background: rgba(148,163,184,0.1); color: #94a3b8; }
</style>
