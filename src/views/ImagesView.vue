<script setup lang="ts">
import { useCloudStore } from '../stores/cloud';
import { ImageIcon, RefreshCcw } from 'lucide-vue-next';
const store = useCloudStore();
function formatBytes(b: number) {
  if (!b) return '—';
  if (b > 1e9) return (b / 1e9).toFixed(1) + ' GB';
  return (b / 1e6).toFixed(1) + ' MB';
}
</script>

<template>
  <div class="view-content">
    <div class="page-header">
      <div>
        <h2>Images</h2>
        <p class="text-muted">{{ store.images.length }} images via Glance</p>
      </div>
      <button class="btn-primary" @click="store.fetchAll()">
        <RefreshCcw :class="['icon', { spin: store.isLoading }]" /> Refresh
      </button>
    </div>

    <div class="panel glass-card">
      <div v-if="!store.images.length" class="empty-state">
        <ImageIcon class="empty-icon" /><p>No images found.</p>
      </div>
      <div v-else class="image-grid">
        <div v-for="img in store.images" :key="img.id" class="image-card glass-card">
          <div class="img-banner" :style="{ background: `hsl(${img.id.charCodeAt(0) * 5}, 50%, 30%)` }">
            <ImageIcon class="img-banner-icon" />
          </div>
          <div class="img-info">
            <p class="img-name">{{ img.name || '(unnamed)' }}</p>
            <div class="img-meta">
              <span :class="['badge-pill', img.status]">{{ img.status }}</span>
              <span class="text-muted mono">{{ img.disk_format?.toUpperCase() }}</span>
              <span class="text-muted">{{ formatBytes(img.size) }}</span>
            </div>
            <p class="img-id mono text-muted">{{ img.id.slice(0,16) }}…</p>
          </div>
        </div>
      </div>
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
.panel { padding: 1.75rem; }
.image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
.image-card { padding: 0; overflow: hidden; transition: all 0.3s; }
.image-card:hover { transform: translateY(-3px); border-color: var(--primary); }
.img-banner {
  height: 96px; display: flex; align-items: center; justify-content: center;
}
.img-banner-icon { width: 40px; height: 40px; color: rgba(255,255,255,0.3); }
.img-info { padding: 1rem; }
.img-name { font-weight: 700; margin-bottom: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.img-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center; font-size: 0.8rem; }
.img-id { font-size: 0.7rem; margin-top: 0.25rem; }
.mono { font-family: monospace; }
.badge-pill { padding: 0.15rem 0.625rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }
.badge-pill.active { background: rgba(52,211,153,0.1); color: #34d399; }
.badge-pill.queued { background: rgba(251,191,36,0.1); color: #fbbf24; }
.badge-pill.deactivated, .badge-pill.killed { background: rgba(244,63,94,0.1); color: #fb7185; }
.empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }
.empty-icon { width: 42px; height: 42px; margin: 0 auto 1rem; opacity: 0.4; }
</style>
