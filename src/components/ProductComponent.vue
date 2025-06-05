<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function goToDetails() {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>

<template>
  <div
    @click="goToDetails"
    class="bg-gray-800/60 border border-indigo-500 rounded-2xl shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.03] transition-all duration-300 cursor-pointer backdrop-blur-md"
  >
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="w-full h-48 object-cover rounded-t-2xl"
    />
    <div class="p-4 text-white">
      <h2 class="font-bold text-lg mb-2 text-cyan-400 tracking-wide">{{ product.title }}</h2>
      <p class="text-indigo-300 text-sm mb-1">Categoria: {{ product.category }}</p>
      <p class="text-green-400 font-semibold mb-1 text-md">Preço: ${{ product.price }}</p>
      <p class="text-xs text-gray-300">Estoque: {{ product.stock }}</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

* {
  font-family: 'Orbitron', sans-serif;
}
</style>
