<script setup>
import HybridEditor from '../components/HybridEditor.vue';
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ $t('hybridEditor.title') }}</h2>
    <p class="text-gray-700 dark:text-gray-300" v-html="$t('hybridEditor.welcome')"></p>
    <HybridEditor />
  </div>
</template>