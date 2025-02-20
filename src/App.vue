<script setup lang="ts">
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Header />
    <div class="app-content">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
