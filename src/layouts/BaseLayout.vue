<script setup>
import { ref } from 'vue';
import SidebarMenu from '../components/SidebarMenu.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <SidebarMenu :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div class="flex items-center">
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <h1 class="text-xl font-semibold ml-4 text-gray-800 dark:text-white">{{ $t('appTitle') }}</h1>
        </div>
        <LanguageSwitcher />
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
