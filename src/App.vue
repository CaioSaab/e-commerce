<script setup>
import NavBarComponent from './components/NavBarComponent.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 font-sans">
    <NavBarComponent />
    <main class="flex-grow container mx-auto p-6 sm:p-10">
      <router-view />
    </main>
    <footer
      class="bg-gray-800 text-center p-4 text-sm text-gray-500 border-t border-gray-700 select-none"
    >
      &copy; 2025 Tudolândia. Todos os direitos reservados.
    </footer>
  </div>
</template>
