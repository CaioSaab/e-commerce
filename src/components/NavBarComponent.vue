<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const searchTerm = ref('')
const cartCount = ref(0)

const router = useRouter()
const route = useRoute()

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  cartCount.value = cart.reduce((acc, item) => acc + item.quantity, 0)
}

watch(searchTerm, (newVal) => {
  router.push({ path: '/', query: { ...route.query, search: newVal, page: 1 } })
})

onMounted(() => {
  updateCartCount()
  window.addEventListener('storage', updateCartCount)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-indigo-600 flex items-center justify-between px-6 py-3"
  >
    <router-link
      to="/"
      class="text-3xl font-extrabold text-indigo-400 hover:text-cyan-400 transition duration-300 tracking-widest drop-shadow-lg"
    >
      Tudolândia
    </router-link>

    <router-link to="/cart" class="relative group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-gray-300 group-hover:text-indigo-400 transition duration-300 drop-shadow-md"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 001.415 1.414L7 13zM16 16a2 2 0 100-4 2 2 0 000 4zm-7 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span
        v-if="cartCount > 0"
        class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 -translate-y-1/2 translate-x-1/2 font-bold shadow-md"
      >
        {{ cartCount }}
      </span>
    </router-link>
  </nav>
</template>
