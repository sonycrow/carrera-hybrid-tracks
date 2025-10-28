<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SidebarMenu from './components/SidebarMenu.vue';

const isSidebarOpen = ref(false);
const { locale } = useI18n();
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
    <SidebarMenu :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700"
      >
        <div class="flex items-center">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="text-gray-500 dark:text-gray-300 focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="flex items-center">
          <!-- Language Selector -->
          <select
            v-model="locale"
            class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-10">
        <router-view />
      </main>
    </div>
  </div>
</template>