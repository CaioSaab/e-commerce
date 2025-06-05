<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(true)

async function loadProduct() {
  loading.value = true
  try {
    const { data } = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = data
  } catch (error) {
    alert('Produto não encontrado')
    router.push('/')
  } finally {
    loading.value = false
  }
}

function addToCart() {
  if (!product.value) return

  let cart = JSON.parse(localStorage.getItem('cart')) || []

  const index = cart.findIndex(item => item.id === product.value.id)

  if (index === -1) {
    cart.push({ ...product.value, quantity: 1 })
  } else {
    cart[index].quantity++
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  alert(`Produto "${product.value.title}" adicionado ao carrinho.`)
}

onMounted(loadProduct)
</script>

<template>
  <div v-if="loading" class="text-center py-12 text-indigo-400 font-orbitron text-xl">
    Carregando...
  </div>

  <div
    v-else
    class="max-w-4xl mx-auto bg-[#1f1f1f] rounded-xl shadow-lg p-8 font-orbitron text-gray-300"
  >
    <h1 class="text-4xl font-extrabold mb-6 tracking-wide text-indigo-400 drop-shadow-lg">
      {{ product.title }}
    </h1>
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="w-64 h-64 object-cover rounded-lg mb-6 border border-indigo-600 shadow-md"
    />
    <p class="mb-3"><strong class="text-indigo-400">Descrição:</strong> {{ product.description }}</p>
    <p class="mb-3"><strong class="text-indigo-400">Categoria:</strong> {{ product.category }}</p>
    <p class="mb-3"><strong class="text-indigo-400">Preço:</strong> ${{ product.price }}</p>
    <p class="mb-3"><strong class="text-indigo-400">Estoque:</strong> {{ product.stock }}</p>

    <button
      @click="addToCart"
      class="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
    >
      Adicionar ao carrinho
    </button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}
</style>
