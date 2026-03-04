<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { useCloudStore } from './stores/cloud';
import {
  LayoutDashboard, Server, HardDrive, Network, Image as ImageIcon,
  Cloud, LogOut, User, ChevronLeft, ChevronRight, Sun, Moon, Layers, Search
} from 'lucide-vue-next';
import { ref } from 'vue';

const store = useCloudStore();
const route = useRoute();
const router = useRouter();
const collapsed = ref(false);

const isPublic = computed(() => route.meta.public);

const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Instances',  icon: Server,           to: '/instances' },
  { label: 'Bare Metal', icon: Layers,           to: '/baremetal/create' },
  { label: 'Volumes',    icon: HardDrive,         to: '/volumes' },
  { label: 'Network',   icon: Network,           to: '/network' },
  { label: 'Images',    icon: ImageIcon,         to: '/images' },
];

function logout() {
  store.logout();
  router.push('/login');
}
</script>

<template>
  <!-- Public pages (login) get no shell -->
  <RouterView v-if="isPublic" />

  <!-- Authenticated layout -->
  <div v-else :class="['shell', { 'thames-bg-light thames-light-theme': !store.isDark }]">
    <aside :class="['sidebar glass-card', { collapsed }]">
      <div class="logo" @click="collapsed = !collapsed">
        <div class="logo-icon"><Cloud /></div>
        <div v-if="!collapsed" class="logo-text">
          <span class="gradient-text">TBL</span>
          <span>Cloud</span>
        </div>
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="collapse-btn" />
      </div>

      <div v-if="!collapsed" class="nav-section-label">Navigation</div>
      <nav>
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['nav-item', { active: route.path === item.to }]"
        >
          <component :is="item.icon" class="nav-icon" />
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          <div v-if="route.path === item.to && !collapsed" class="active-bar"></div>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="avatar"><User /></div>
          <div v-if="!collapsed" class="user-text">
            <p class="user-name">{{ store.user?.name ?? 'Admin' }}</p>
            <p class="user-role">Administrator</p>
          </div>
        </div>
        <button class="theme-toggle mb-2" @click="store.toggleTheme()" :title="'Toggle Thames Theme'">
          <div class="theme-switch-icon">
            <Sun v-if="store.isDark" class="icon" />
            <Moon v-else class="icon" />
          </div>
          <span v-if="!collapsed" class="theme-label">Thames Mode</span>
        </button>

        <button class="logout-btn" @click="logout" :title="'Sign out'">
          <LogOut class="nav-icon" />
          <span v-if="!collapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <main class="main">
      <div class="topbar glass-card">
        <div class="breadcrumb">
          <Cloud class="bc-icon" />
          <span class="gradient-text font-bold">TBL Cloud</span>
          <span class="text-muted">/ {{ route.path.replace('/', '') || 'dashboard' }}</span>
        </div>

        <div class="search-bar glass-card">
          <Search class="search-icon" />
          <input v-model="store.searchQuery" type="text" placeholder="Search resources, VMs, nodes..." />
        </div>

        <div class="topbar-right">
          <div class="status-pill" :class="{ error: !!store.error }">
            <span class="status-dot"></span>
            {{ store.error ? 'API Error' : 'Connected' }}
          </div>
        </div>
      </div>

      <div class="page-wrap">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-dark);
}

/* Sidebar */
.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  margin: 1rem 0 1rem 1rem;
  border-radius: 1.5rem;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar.collapsed { width: 80px; }

.logo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.5rem;
  margin-bottom: 2.5rem;
  cursor: pointer;
  border-radius: 0.875rem;
  transition: background 0.2s;
}
.logo:hover { background: rgba(255,255,255,0.05); }

.logo-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--primary), #c084fc);
  border-radius: 0.875rem;
  display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
}
.logo-icon > * { width: 22px; height: 22px; }

.logo-text {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  flex: 1;
}

.collapse-btn { width: 18px; height: 18px; color: var(--text-muted); flex-shrink: 0; }

.nav-section-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 1rem;
  margin-bottom: 0.75rem;
  opacity: 0.6;
}

nav { flex: 1; display: flex; flex-direction: column; gap: 0.375rem; }

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.8rem 1rem;
  border-radius: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.nav-item:hover { background: rgba(99,102,241,0.08); color: var(--primary); }
.nav-item.active { background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; box-shadow: 0 8px 16px rgba(99,102,241,0.3); }

.nav-icon { width: 20px; height: 20px; flex-shrink: 0; }
.active-bar { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: white; border-radius: 2px; }

.sidebar-footer { padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.75rem; }
.user-row { display: flex; align-items: center; gap: 0.875rem; padding: 0.5rem; }
.avatar { width: 36px; height: 36px; background: rgba(99,102,241,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar > * { width: 18px; height: 18px; color: var(--primary); }
.user-name { font-weight: 700; font-size: 0.875rem; }
.user-role { font-size: 0.7rem; color: var(--text-muted); }

.logout-btn { display: flex; align-items: center; gap: 0.875rem; padding: 0.75rem 1rem; border-radius: 0.875rem; border: none; color: #fb7185; font-size: 0.875rem; font-weight: 600; width: 100%; transition: background 0.2s; }
.logout-btn:hover { background: rgba(244, 63, 94, 0.1); transform: none; }

/* Main */
.main { flex: 1; display: flex; flex-direction: column; padding: 1rem 1rem 1rem 0; overflow: hidden; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  width: 400px;
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}
.search-icon { width: 16px; height: 16px; color: var(--text-muted); }
.search-bar input {
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 0.875rem;
  width: 100%;
  outline: none;
}
.search-bar input::placeholder { color: var(--text-muted); opacity: 0.6; }

.topbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.875rem 1.5rem; margin-bottom: 1.5rem; border-radius: 1.25rem;
}
.breadcrumb { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.bc-icon { width: 18px; height: 18px; color: var(--primary); }
.font-bold { font-weight: 700; }

.status-pill { display: flex; align-items: center; gap: 0.5rem; background: rgba(52,211,153,0.1); color: #34d399; border-radius: 9999px; padding: 0.25rem 0.875rem; font-size: 0.75rem; font-weight: 700; }
.status-pill.error { background: rgba(244,63,94,0.1); color: #fb7185; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: blink 1.5s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.page-wrap { flex: 1; overflow-y: auto; padding-right: 0.25rem; }

.theme-toggle {
  background: var(--glass);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 0.4rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  width: 100%;
}
.sidebar.collapsed .theme-toggle { padding: 0.4rem; width: auto; align-self: center; }
.theme-toggle:hover { background: rgba(99,102,241,0.1); border-color: var(--primary); }
.theme-switch-icon {
  width: 32px; height: 32px;
  background: var(--primary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white;
  flex-shrink: 0;
}
.theme-switch-icon .icon { width: 16px; height: 16px; }
.theme-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding-right: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }

.mr-4 { margin-right: 1rem; }
</style>
