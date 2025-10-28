<script setup>
// El cambio de idioma es manejado por vue-i18n globalmente
</script>

<template>
  <div class="relative">
    <select v-model="$i18n.locale" class="w-full px-4 py-2 text-white bg-gray-700 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇬🇧 English</option>
    </select>
  </div>
</template>