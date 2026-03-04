<script setup lang="ts">
import { useCloudStore } from '../stores/cloud';
import { Database, RefreshCcw } from 'lucide-vue-next';
const store = useCloudStore();
function statusClass(s: string) {
  return { available: 'success', error: 'error', in_use: 'warn', 'in-use': 'warn' }[s] ?? 'muted';
}
</script>

<template>
  <div class="view-content">
    <div class="page-header">
      <div>
        <h2>Block Storage</h2>
        <p class="text-muted">{{ store.volumes.length }} volumes · {{ store.totalVolumeGB }} GB total</p>
      </div>
      <button class="btn-primary" @click="store.fetchAll()">
        <RefreshCcw :class="['icon', { spin: store.isLoading }]" /> Refresh
      </button>
    </div>

    <div class="panel glass-card">
      <div v-if="!store.volumes.length" class="empty-state">
        <Database class="empty-icon" /><p>No volumes found.</p>
      </div>
      <table v-else class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Size</th><th>Type</th><th>Bootable</th><th>Attached To</th><th>Created</th></tr></thead>
        <tbody>
          <tr v-for="v in store.volumes" :key="v.id">
            <td class="fw-bold">{{ v.name || '(unnamed)' }}</td>
            <td><span :class="['badge-pill', statusClass(v.status)]">{{ v.status }}</span></td>
            <td><div class="size-pill">{{ v.size }} GB</div></td>
            <td class="text-muted">{{ v.volume_type ?? '—' }}</td>
            <td><span :class="['badge-pill', v.bootable === 'true' ? 'success' : 'muted']">{{ v.bootable === 'true' ? 'Yes' : 'No' }}</span></td>
            <td class="mono text-muted">{{ v.attachments?.length ? v.attachments[0].server_id.slice(0,12)+'…' : '—' }}</td>
            <td class="mono text-muted">{{ new Date(v.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
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
.panel { padding: 1.75rem; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding-bottom: 1.25rem; }
.data-table td { padding: 1rem 0; border-top: 1px solid var(--border); font-size: 0.875rem; }
.fw-bold { font-weight: 600; }
.mono { font-family: monospace; font-size: 0.8rem; }
.size-pill { display: inline-block; background: rgba(99,102,241,0.1); color: var(--primary); border-radius: 0.5rem; padding: 0.1rem 0.625rem; font-weight: 700; font-size: 0.8rem; }
.badge-pill { padding: 0.2rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.badge-pill.success { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.muted { background: rgba(148,163,184,0.1); color: #94a3b8; }
.badge-pill.error { background: rgba(244,63,94,0.1); color: #fb7185; }
.badge-pill.warn { background: rgba(251,191,36,0.1); color: #fbbf24; }
.empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }
.empty-icon { width: 42px; height: 42px; margin: 0 auto 1rem; opacity: 0.4; }
</style>
