<script setup>
defineProps({
  isOpen: Boolean,
});

defineEmits(['close']);

const menuItems = [
  { name: 'navigation.home', path: '/home' },
  { name: 'navigation.tracks', path: '/tracks' }
];
</script>

<template>
  <div>
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="$emit('close')"
      class="fixed inset-0 z-20 bg-black opacity-50 transition-opacity"
    ></div>
    <div
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out"
    >
      <div class="flex items-center justify-between mt-8 px-6">
        <span class="text-gray-800 dark:text-white text-2xl font-semibold">{{ $t('navigation.title') }}</span>
        <button @click="$emit('close')" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <nav class="mt-10">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          @click="$emit('close')"
          class="flex items-center mt-4 py-2 px-6 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <span class="mx-3">{{ $t(item.name) }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>