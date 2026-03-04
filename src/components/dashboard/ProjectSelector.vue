<script setup lang="ts">
import { useCloudStore } from '../../stores/cloud';
import { LucideFolderBox, LucideChevronDown } from 'lucide-vue-next';

const store = useCloudStore();

const handleSwitch = (projectName: string) => {
  if (projectName === store.currentProjectName) return;
  // This would ideally prompt for password if not stored, 
  // but for this demo/exercise we're just setting up the UI.
  alert(`Switching to ${projectName}... (Re-authentication required in production)`);
};
</script>

<template>
  <div class="project-selector" v-if="store.userProjects.length > 0">
    <div class="selector-trigger">
      <LucideFolderBox class="icon" />
      <span class="current-name">{{ store.currentProjectName || 'Select Project' }}</span>
      <LucideChevronDown class="chevron" />
    </div>
    <div class="project-dropdown">
      <div 
        v-for="prj in store.userProjects" 
        :key="prj.id" 
        class="project-item"
        :class="{ active: prj.name === store.currentProjectName }"
        @click="handleSwitch(prj.name)"
      >
        <div class="prj-info">
          <p class="name">{{ prj.name }}</p>
          <p class="id">{{ prj.id.substring(0, 8) }}...</p>
        </div>
        <div v-if="prj.name === store.currentProjectName" class="active-dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-selector {
  position: relative;
  cursor: pointer;
}

.selector-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.selector-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
}

.icon {
  width: 18px;
  height: 18px;
  color: var(--primary-light);
}

.current-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.chevron {
  width: 14px;
  height: 14px;
  margin-left: 0.5rem;
  opacity: 0.5;
}

.project-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 240px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s;
  z-index: 100;
}

.project-selector:hover .project-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.project-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.project-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.project-item.active {
  background: rgba(99, 102, 241, 0.1);
}

.name {
  font-weight: 600;
  font-size: 0.85rem;
  margin: 0;
}

.id {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0;
}

.active-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary);
}
</style>
