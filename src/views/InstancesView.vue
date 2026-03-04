<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useCloudStore } from '../stores/cloud';
import { 
  Server, RefreshCcw, Play, Square, Trash2, Terminal, 
  MoreVertical, Monitor, RotateCw 
} from 'lucide-vue-next';
import ProjectSelector from '../components/dashboard/ProjectSelector.vue';

const store = useCloudStore();
const activeMenu = ref<string | null>(null);

function statusClass(s: string) {
  const m: Record<string, string> = { ACTIVE: 'success', SHUTOFF: 'muted', ERROR: 'error', BUILD: 'warn' };
  return m[s] ?? 'muted';
}

function getIPsArray(inst: any): string[] {
  if (!inst.addresses) return [];
  return Object.values(inst.addresses).flat().map((a: any) => a.addr);
}

const copiedId = ref<string | null>(null);
function copyToClipboard(txt: string) {
  navigator.clipboard.writeText(txt);
  copiedId.value = txt;
  setTimeout(() => copiedId.value = null, 2000);
}

async function handleAction(serverId: string, action: string) {
  activeMenu.value = null;
  try {
    if (action === 'start') await store.startInstance(serverId);
    else if (action === 'stop') await store.stopInstance(serverId);
    else if (action === 'rebuild') {
      const inst = store.instances.find(i => i.id === serverId);
      const imgId = inst?.image?.id || store.images[0]?.id;
      if (imgId) await store.rebuildInstance(serverId, imgId);
    }
    else if (action === 'vnc') {
      const console = await store.getVncConsole(serverId);
      if (console?.url) window.open(console.url, '_blank');
    }
  } catch (e) {
    console.error('Action failed:', e);
  }
}

// Close menu on click outside
function closeMenu(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.menu-container')) {
    activeMenu.value = null;
  }
}

onMounted(() => window.addEventListener('click', closeMenu));
onUnmounted(() => window.removeEventListener('click', closeMenu));
</script>

<template>
  <div class="view-content">
    <div class="page-header">
      <div class="header-left">
        <div>
          <h2>Compute Instances</h2>
          <p class="text-muted">{{ store.filteredInstances.length }} instances matches</p>
        </div>
        <ProjectSelector class="ml-6" />
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="store.fetchAll()">
          <RefreshCcw :class="['icon', { spin: store.isLoading }]" />
        </button>
        <router-link to="/instances/create" class="btn-launch">
          <Play class="icon" /> Launch Instance
        </router-link>
      </div>
    </div>

    <div class="panel glass-card">
      <div v-if="store.filteredInstances.length === 0" class="empty-state">
        <Server class="empty-icon" />
        <p>No instances found.</p>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>IP Addresses</th>
            <th>Flavor</th>
            <th>Monthly Cost</th>
            <th>Image</th>
            <th>Created</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inst in store.filteredInstances" :key="inst.id" class="table-row">
            <td>
              <div class="cell-icon-text">
                <div :class="['instance-dot', statusClass(inst.status)]"></div>
                <span class="fw-bold">{{ inst.name }}</span>
              </div>
            </td>
            <td><span :class="['badge-pill', statusClass(inst.status)]">{{ inst.status }}</span></td>
            <td class="mono">
              <div class="ip-group">
                <div v-for="ip in getIPsArray(inst)" :key="ip" class="ip-badge" @click="copyToClipboard(ip)">
                  {{ ip }}
                  <span class="ip-copy-hint" v-if="copiedId === ip">Copied!</span>
                </div>
                <span v-if="getIPsArray(inst).length === 0">—</span>
              </div>
            </td>
            <td class="mono text-muted">{{ inst.flavor?.original_name ?? inst.flavor?.id ?? '—' }}</td>
            <td>
              <span class="price-badge" v-if="inst.flavor">
                ${{ (inst.flavor.vcpus * 5 + (inst.flavor.ram / 1024) * 2).toFixed(2) }}
              </span>
              <span v-else>—</span>
            </td>
            <td class="text-muted ellipsis" style="max-width:160px">{{ inst.image?.id?.slice(0,8) ?? 'volume' }}…</td>
            <td class="mono text-muted">{{ new Date(inst.created).toLocaleDateString() }}</td>
            <td class="text-right">
              <div class="menu-container">
                <button class="btn-menu" @click.stop="activeMenu = activeMenu === inst.id ? null : inst.id">
                  <MoreVertical class="icon" />
                </button>
                <div v-if="activeMenu === inst.id" class="dropdown-menu glass-card">
                  <button v-if="inst.status === 'SHUTOFF'" @click="handleAction(inst.id, 'start')">
                    <Play class="icon-sm" /> Start Instance
                  </button>
                  <button v-if="inst.status === 'ACTIVE'" @click="handleAction(inst.id, 'stop')">
                    <Square class="icon-sm" /> Stop Instance
                  </button>
                  <button @click="handleAction(inst.id, 'rebuild')">
                    <RotateCw class="icon-sm" /> Rebuild
                  </button>
                  <button @click="handleAction(inst.id, 'vnc')">
                    <Monitor class="icon-sm" /> VNC Console
                  </button>
                  <div class="menu-divider"></div>
                  <button class="text-error" @click="handleAction(inst.id, 'delete')">
                    <Trash2 class="icon-sm" /> Terminate
                  </button>
                </div>
              </div>
            </td>
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
.header-actions { display: flex; gap: 1rem; align-items: center; }
.search-input {
  background: var(--glass);
  border: 1px solid var(--border);
  padding: 0.75rem 1.25rem;
  border-radius: 0.875rem;
  color: var(--text-main);
  outline: none;
  width: 260px;
  font-size: 0.875rem;
}
.btn-primary {
  display: flex; align-items: center; gap: 0.5rem;
  background: var(--primary); color: white; border: none;
  padding: 0.75rem 1.25rem; border-radius: 0.875rem; font-weight: 700;
}
.icon { width: 16px; height: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.panel { padding: 1.75rem; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  text-align: left; font-size: 0.7rem; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text-muted); padding-bottom: 1.25rem;
}
.data-table td { padding: 1rem 0; border-top: 1px solid var(--border); font-size: 0.875rem; }
.table-row:hover td { background: rgba(99,102,241,0.03); }
.cell-icon-text { display: flex; align-items: center; gap: 0.75rem; }
.instance-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.instance-dot.success { background: #34d399; box-shadow: 0 0 8px #34d399; }
.instance-dot.muted { background: #94a3b8; }
.instance-dot.error { background: #fb7185; box-shadow: 0 0 8px #fb7185; }
.instance-dot.warn { background: #fbbf24; }

.fw-bold { font-weight: 600; }
.mono { font-family: monospace; font-size: 0.8rem; }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ip-group { display: flex; flex-direction: column; gap: 0.25rem; }
.ip-badge {
  display: inline-flex; align-items: center; padding: 0.15rem 0.5rem;
  background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
  border-radius: 4px; cursor: pointer; transition: all 0.2s; position: relative;
  color: var(--primary); font-weight: 600;
}
.ip-badge:hover { background: rgba(99,102,241,0.15); border-color: var(--primary); color: var(--primary-hover); }
.price-badge {
  background: rgba(52, 211, 153, 0.1);
  color: #34d399;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid rgba(52, 211, 153, 0.2);
}
.ip-copy-hint {
  position: absolute; top: -1.5rem; left: 50%; transform: translateX(-50%);
  background: var(--primary); color: white; font-size: 0.65rem; padding: 0.1rem 0.4rem;
  border-radius: 4px; z-index: 10;
}

.badge-pill {
  padding: 0.2rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
}
.badge-pill.success { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.muted { background: rgba(148,163,184,0.1); color: #94a3b8; }
.badge-pill.error { background: rgba(244,63,94,0.1); color: #fb7185; }
.badge-pill.warn { background: rgba(251,191,36,0.1); color: #fbbf24; }

.btn-launch {
  display: flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary), #4f46e5);
  color: white; border: none; text-decoration: none;
  padding: 0.75rem 1.25rem; border-radius: 0.875rem; font-weight: 700;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}
.btn-launch:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-launch .icon { width: 14px; height: 14px; }

.empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }
.empty-icon { width: 42px; height: 42px; margin: 0 auto 1rem; opacity: 0.4; }

.text-right { text-align: right; }
.menu-container { position: relative; display: inline-block; }
.btn-menu {
  background: transparent; border: none; color: var(--text-muted); padding: 0.4rem;
  border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center;
}
.btn-menu:hover { background: rgba(255, 255, 255, 0.05); color: white; }

.dropdown-menu {
  position: absolute; right: 0; top: 110%; width: 180px; z-index: 100;
  padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid var(--border);
}
.dropdown-menu button {
  background: transparent; border: none; color: var(--text-main); font-size: 0.8rem;
  padding: 0.6rem 0.75rem; border-radius: 0.5rem; text-align: left;
  display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.2s;
}
.dropdown-menu button:hover { background: rgba(99,102,241,0.1); color: var(--primary-light); }
.dropdown-menu button.text-error { color: #fb7185; }
.dropdown-menu button.text-error:hover { background: rgba(244,63,94,0.1); }

.icon-sm { width: 14px; height: 14px; }
.menu-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }
</style>
