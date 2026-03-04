<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCloudStore } from '../stores/cloud';
import { Cloud, ShieldCheck } from 'lucide-vue-next';

const router = useRouter();
const store = useCloudStore();

const username = ref('Users Name');
const password = ref('####S');
const email = ref('');
const isSignup = ref(false);
const loading = ref(false);
const err = ref('');
const success = ref('');

async function handleSubmit() {
  loading.value = true;
  err.value = '';
  success.value = '';
  try {
    if (isSignup.value) {
      await store.signup(username.value, password.value, email.value);
      success.value = 'Account created! You can now sign in.';
      isSignup.value = false;
    } else {
      await store.login(username.value, password.value);
      router.push('/dashboard');
    }
  } catch (e: any) {
    const msg = e?.response?.data?.error?.message ?? e?.message ?? 'Action failed';
    err.value = `${isSignup.value ? 'Signup' : 'Login'} failed: ${msg}`;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div :class="['login-page', { 'thames-bg-light thames-light-theme': !store.isDark }]">
    <div class="login-bg"></div>
    <div class="login-card glass-card">
      <div class="login-logo">
        <div class="logo-icon">
          <Cloud class="w-10 h-10" />
        </div>
        <h1 class="gradient-text">TBL Cloud</h1>
        <p class="subtitle">{{ isSignup ? 'Create your platform account' : 'OpenStack Management Portal' }}</p>
      </div>

      <div v-if="success" class="success-msg">{{ success }}</div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="isSignup" class="field">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="user@example.com" required />
        </div>
        <div class="field">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="user " autocomplete="username" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" required />
        </div>

        <div v-if="err" class="err-msg">{{ err }}</div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">{{ isSignup ? 'Create Account' : 'Sign In' }}</span>
          <span v-else class="loading-dots">Processing<span>.</span><span>.</span><span>.</span></span>
        </button>
      </form>

      <div class="toggle-auth">
        <p v-if="!isSignup">Don't have an account? <a @click="isSignup = true">Create one</a></p>
        <p v-else>Already have an account? <a @click="isSignup = false">Sign in instead</a></p>
      </div>

      <div class="login-footer">
        <ShieldCheck class="w-4 h-4" />
        <span>Secured via Cloudflare Tunnel · identity.tblinstance.online</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.1) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(192,132,252,0.1) 0%, transparent 50%);
  animation: bgshift 8s ease-in-out infinite alternate;
}

@keyframes bgshift {
  from { opacity: 0.8; }
  to { opacity: 1; }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 3rem;
}

.login-logo {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--primary), #c084fc);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: 0 20px 40px rgba(99,102,241,0.4);
  color: white;
}

h1 {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -1px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-top: 0.375rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input {
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.field input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.err-msg {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.3);
  border-radius: 0.75rem;
  padding: 0.875rem;
  color: #fb7185;
  font-size: 0.875rem;
}

.btn-login {
  background: linear-gradient(135deg, var(--primary), #4f46e5);
  color: white;
  border: none;
  border-radius: 0.875rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0.5rem;
  box-shadow: 0 10px 20px rgba(99,102,241,0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-dots span {
  animation: blink 1.2s infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

.success-msg {
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 0.75rem;
  padding: 0.875rem;
  color: #34d399;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.toggle-auth {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.toggle-auth a {
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  margin-left: 0.25rem;
}
.toggle-auth a:hover {
  text-decoration: underline;
}

.login-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.75rem;
}
</style>
