<script setup lang="ts">
import { Terminal } from 'lucide-vue-next';
</script>

<template>
  <section class="os-support">
    <div class="container split">
      <div class="os-content">
        <h2>Ready for <span>Any Workflow</span></h2>
        <p>Deploy your favorite operating system in under 60 seconds. We provide optimized images for all major distributions with pre-installed cloud-init.</p>
        <div class="os-grid">
          <a href="https://cloud.tblinstance.store/instances/create?os=ubuntu" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_no-text.svg" alt="Ubuntu" /> <span>Ubuntu</span></a>
          <a href="https://cloud.tblinstance.store/instances/create?os=debian" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Debian-OpenLogo.svg" alt="Debian" /> <span>Debian</span></a>
          <a href="https://cloud.tblinstance.store/instances/create?os=fedora" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Fedora_logo_%282021%29.svg" alt="Fedora" /> <span>Fedora</span></a>
          <a href="https://cloud.tblinstance.store/instances/create?os=windows" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_gradient.svg" alt="Windows" /> <span>Windows Server</span></a>
          <a href="https://cloud.tblinstance.store/instances/create?os=centos" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/CentOS_logo.svg" alt="CentOS" /> <span>CentOS</span></a>
          <a href="https://cloud.tblinstance.store/instances/create" class="os-item"><img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Custom" /> <span>Custom ISO</span></a>
        </div>
      </div>
      <div class="os-visual">
         <Terminal class="big-icon" />
      </div>
    </div>
  </section>
</template>
