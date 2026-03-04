<script setup lang="ts">
import { ref } from 'vue';
import { useCloudStore } from '../../stores/cloud';
import { Cloud, Globe, ChevronDown, Sun, Moon, Menu, X } from 'lucide-vue-next';

const store = useCloudStore();
const menuOpen = ref(false);
const toggleMenu = () => { menuOpen.value = !menuOpen.value; };
const closeMenu = () => { menuOpen.value = false; };
</script>

<template>
  <nav class="top-nav">
    <div class="nav-container">
      <!-- Brand -->
      <div class="brand">
        <Cloud class="logo-icon" />
        <span>TBL Cloud</span>
        <div class="status-indicator-full">
          <span class="pulse-ring"></span>
          <span class="status-dot"></span>
          <span class="status-text">All Systems Operational</span>
        </div>
      </div>

      <!-- Desktop Nav Links -->
      <div class="nav-links desktop-nav">
        <a href="#vps">VPS</a>
        <a href="#pricing">Pricing</a>

        <div class="lang-switcher">
          <Globe class="nav-icon-s" />
          <span>EN</span>
          <ChevronDown class="nav-icon-xs" />
        </div>

        <button @click="store.toggleTheme()" class="theme-btn" title="Toggle Theme">
          <Sun v-if="store.isDark" class="nav-icon" />
          <Moon v-else class="nav-icon" />
        </button>

        <a href="https://cloud.tblinstance.store/login" class="nav-link">Login</a>
        <a href="https://cloud.tblinstance.store/login" class="btn-login">Sign Up</a>
      </div>

      <!-- Mobile Right Side -->
      <div class="mobile-nav-right">
        <button @click="store.toggleTheme()" class="theme-btn" title="Toggle Theme">
          <Sun v-if="store.isDark" class="nav-icon" />
          <Moon v-else class="nav-icon" />
        </button>
        <!-- Hamburger Button -->
        <button class="hamburger-btn" @click="toggleMenu" :class="{ open: menuOpen }">
          <X v-if="menuOpen" class="nav-icon" />
          <Menu v-else class="nav-icon" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="mobile-menu">
        <a href="#vps" @click="closeMenu">VPS</a>
        <a href="#pricing" @click="closeMenu">Pricing</a>
        <div class="mobile-menu-divider"></div>
        <a href="https://cloud.tblinstance.store/login" @click="closeMenu" class="mobile-login">Login</a>
        <a href="https://cloud.tblinstance.store/login" @click="closeMenu" class="mobile-signup btn-login">Sign Up Free</a>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Desktop nav links always visible */
.desktop-nav { display: flex; }
/* Mobile right side buttons (theme + hamburger) hidden on desktop */
.mobile-nav-right { display: none; }
.mobile-menu { display: none; }

/* === TABLET / MOBILE: ≤ 768px === */
@media (max-width: 768px) {
  .desktop-nav { display: none !important; }
  .mobile-nav-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hamburger-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #94a3b8;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .hamburger-btn:hover,
  .hamburger-btn.open {
    background: rgba(99,102,241,0.15);
    color: #818cf8;
    border-color: rgba(99,102,241,0.3);
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    background: rgba(3, 7, 18, 0.97);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 1rem 1.5rem 1.5rem;
  }

  .mobile-menu a {
    color: #d1d5db;
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.9rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: #818cf8; }
  .mobile-menu a:last-child { border-bottom: none; }

  .mobile-menu-divider { margin: 0.5rem 0; }

  .mobile-login { color: #94a3b8 !important; }

  .mobile-signup {
    margin-top: 0.75rem;
    text-align: center;
    background: #6366f1 !important;
    color: #fff !important;
    border-radius: 12px;
    padding: 0.9rem !important;
    font-size: 1rem !important;
  }

  /* Light theme mobile menu */
  .thames-light-theme .mobile-menu {
    background: rgba(248, 250, 252, 0.98);
    border-top-color: #e2e8f0;
  }
  .thames-light-theme .mobile-menu a { color: #334155; border-bottom-color: #e2e8f0; }
  .thames-light-theme .mobile-menu a:hover { color: #6366f1; }
}

/* Transition animation */
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
