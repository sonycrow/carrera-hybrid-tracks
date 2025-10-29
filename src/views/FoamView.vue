<script setup>
import FoamEditor from '../components/FoamEditor.vue';
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ $t('foamEditor.title') }}</h2>
    <p class="text-gray-700 dark:text-gray-300" v-html="$t('foamEditor.welcome')"></p>
    <FoamEditor />
  </div>
</template>
